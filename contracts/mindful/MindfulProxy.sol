pragma solidity 0.6.4;

pragma experimental ABIEncoderV2;

import "./UniLib.sol";

import "@pie-dao/proxy/contracts/PProxyPausable.sol";

import "../interfaces/IBFactory.sol";
import "../interfaces/IBPool.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "../interfaces/IUniswapV2Exchange.sol";
import "../interfaces/IPSmartPool.sol";
import "../interfaces/IPV2SmartPool.sol";

import "../libraries/LibSafeApprove.sol";

import "../Ownable.sol";

contract MindfulProxy is Ownable {
    using SafeMath for uint256;
    using LibSafeApprove for IERC20;

    IUniswapV2Factory constant UNISWAP_FACTORY = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
    // ISmartPoolRegistry public constant REGISTRY = ISmartPoolRegistry(
    //   0x412a5d5eC35fF185D6BfF32a367a985e1FB7c296
    // );

    struct SellStrategy {
        string name;
        uint256 id;
        uint256[] prices; // price threshold
        address[] sellTokens; // token to sell to for each price point
        bool[] isExecuted;
        bool isActive; // chakra manager can disable strategy
    }

    struct BuyStrategy {
        string name;
        uint256 id;
        uint256 interBuyDelay;
        uint256 buyAmount;
        uint256 lastBuyTimestamp;
        address buyToken;
        bool isActive; // chakra manager can disable strategy
    }

    IBFactory public balancerFactory;

    address public smartPoolImplementation;

    bool public isPaused;

    /// @notice mapping between chakra and manager address
    mapping(address => address) public chakraManager;
    /// @notice mapping of chakra
    mapping(address => bool) public isChakra;
    // mapping between sell strategy id and chakra (strategy id = index in strategies array)
    mapping(uint256 => address) public sellStrategyChakra;
    // mapping between buy strategy id and chakra (strategy id = index in strategies array))
    mapping(uint256 => address) public buyStrategyChakra;

    address[] public chakras;
    SellStrategy[] public sellStrategies;
    BuyStrategy[] public buyStrategies;

    constructor() public {
        _setOwner(msg.sender);
    }

    event SmartPoolCreated(address indexed chakra, address indexed chakraManager, string name, string symbol);
    event BuyStrategyAdded(address indexed chakra, string buyStrategyName, uint256 indexed buyStrategyId);
    event SellStrategyAdded(address indexed chakra, string sellStrategyName, uint256 indexed sellStrategyId);
    event BuyStrategyDisabled(address indexed chakra, uint256 indexed buyStrategyId);
    event SellStrategyDisabled(address indexed chakra, uint256 indexed sellStrategyId);
    event BuyStrategyEnabled(address indexed chakra, uint256 indexed buyStrategyId);
    event SellStrategyEnabled(address indexed chakra, uint256 indexed sellStrategyId);
    event SellStrategyUpdated(address indexed chakra, uint256 indexed sellStrategyId); 
    event BuyStrategyUpdated(address indexed chakra, uint256 indexed sellStrategyId);

    // Pauzer
    modifier revertIfPaused {
        if (isPaused) {
            revert();
        } else {
            _;
        }
    }

    modifier onlyChakraManager(address _chakra, address _sender) {
        require(chakraManager[_chakra] == _sender);

        _;
    }

    function init(address _balancerFactory, address _implementation) public {
        require(smartPoolImplementation == address(0));
        _setOwner(msg.sender);
        balancerFactory = IBFactory(_balancerFactory);

        smartPoolImplementation = _implementation;
    }

    function togglePause() public onlyOwner {
        isPaused = !isPaused;
    }

    // What is this !!
    // function die() public onlyOwner {
    //   address payable _to = payable(los().owner);
    //   selfdestruct(_to);
    // }

    function newProxiedSmartPool(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address[] memory _tokens,
        uint256[] memory _amounts,
        uint256[] memory _weights,
        uint256 _cap
    ) public revertIfPaused returns (address) {
        // Deploy proxy contract
        PProxyPausable proxy = new PProxyPausable();

        // Setup proxy
        proxy.setImplementation(smartPoolImplementation);
        proxy.setPauzer(address(this));
        proxy.setProxyOwner(address(this));

        // Setup balancer pool
        address balancerPoolAddress = balancerFactory.newBPool();
        IBPool bPool = IBPool(balancerPoolAddress);

        for (uint256 i = 0; i < _tokens.length; i++) {
            IERC20 token = IERC20(_tokens[i]);
            // Transfer tokens to this contract
            token.transferFrom(msg.sender, address(this), _amounts[i]);
            // Approve the balancer pool
            token.safeApprove(balancerPoolAddress, uint256(-1));
            // Bind tokens
            bPool.bind(_tokens[i], _amounts[i], _weights[i]);
        }
        bPool.setController(address(proxy));

        // Setup smart pool
        IPV2SmartPool smartPool = IPV2SmartPool(address(proxy));

        smartPool.init(balancerPoolAddress, _name, _symbol, _initialSupply);
        smartPool.setCap(_cap);
        smartPool.setPublicSwapSetter(address(this));
        smartPool.setTokenBinder(address(this));
        smartPool.setController(address(this));
        smartPool.approveTokens();

        isChakra[address(smartPool)] = true;
        chakraManager[address(smartPool)] = msg.sender;
        chakras.push(address(smartPool));

        emit SmartPoolCreated(address(smartPool), msg.sender, _name, _symbol);

        smartPool.transfer(msg.sender, _initialSupply);

        return address(smartPool);
    }

    // todod: add isRelayer param, add fee calculation, return fee equal to zero if isRelayer = false
    function calcToChakra(
        address _chakra,
        address _curreny,
        uint256 _poolAmount
    ) public view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmount);

        uint256 totalBaseAmount = 0;
        uint256 relayerFee;

        for (uint256 i = 0; i < tokens.length; i++) {
            // enable recursive chakras
            if (isChakra[tokens[i]]) {
                uint256 internalTotalBaseAmount = calcToChakra(tokens[i], _curreny, amounts[i]);
                totalBaseAmount += internalTotalBaseAmount;
            } else {
                (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
                    address(UNISWAP_FACTORY),
                    _curreny,
                    tokens[i]
                );
                totalBaseAmount += UniLib.getAmountIn(amounts[i], reserveA, reserveB);
            }
        }

        return totalBaseAmount;
    }

    function setImplementation(address _implementation) external onlyOwner {
        smartPoolImplementation = _implementation;
    }

    function addSellStrategy(
        address _chakra,
        string calldata _name,
        address[] calldata _sellTokens,
        uint256[] calldata _prices
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        require(_prices.length == _sellTokens.length);

        uint256[] memory prices = new uint256[](_prices.length);
        address[] memory sellTokens = new address[](_prices.length);
        bool[] memory isExecuted = new bool[](_prices.length);

        for (uint256 i = 0; i < _prices.length; i++) {
            require(_prices[i] > 0);
            // should we check if _sellTokens[i] is in chakra ?
            require(_sellTokens[i] != address(0));

            prices[i] = _prices[i];
            sellTokens[i] = _sellTokens[i];
            isExecuted[i] = true;
        }

        uint256 sellStrategyId = sellStrategies.length.add(1);
        SellStrategy memory sellStrategy = SellStrategy(_name, sellStrategyId, prices, sellTokens, isExecuted, true);
        sellStrategyChakra[sellStrategyId] = _chakra;
        sellStrategies.push(sellStrategy);

        emit SellStrategyAdded(_chakra, _name, sellStrategyId);
    }

    function addBuyStrategy(
        address _chakra,
        address _buyToken,
        string calldata _name,
        uint256 _interBuyDelay,
        uint256 _buyAmount
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        // should we add a min value for _interBuyDelay?
        require(_interBuyDelay > 0);     
        require(_buyAmount > 0); 
        require(_buyToken != address(0)); 

        uint256 buyStrategyId = buyStrategies.length.add(1); 
        BuyStrategy memory buyStrategy = BuyStrategy(_name, buyStrategyId, _interBuyDelay, _buyAmount, uint256(0), _buyToken, true);
        buyStrategyChakra[buyStrategyId] = _chakra;
        buyStrategies.push(buyStrategy);

        emit BuyStrategyAdded(_chakra, _name, buyStrategyId);
    }

    function disableSellStrategy(
        address _chakra,
        uint256 _sellStrategyId
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        require(_sellStrategyId <= sellStrategies.length);
        require(sellStrategyChakra[_sellStrategyId] == _chakra);

        uint256 sellStrategyIndex = _sellStrategyId.sub(1);
        SellStrategy storage sellStrategy = sellStrategies[sellStrategyIndex];
        sellStrategy.isActive = false;

        emit SellStrategyDisabled(_chakra, _sellStrategyId);
    }

    function disableBuyStrategy(
        address _chakra,
        uint256 _buyStrategyId
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        require(_buyStrategyId <= buyStrategies.length);
        require(buyStrategyChakra[_buyStrategyId] == _chakra);

        uint256 buyStrategyIndex = _buyStrategyId.sub(1);
        BuyStrategy storage buyStrategy = buyStrategies[buyStrategyIndex];
        buyStrategy.isActive = false;

        emit BuyStrategyDisabled(_chakra, _buyStrategyId);
    }

    function enableSellStrategy(
        address _chakra,
        uint256 _sellStrategyId
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        require(_sellStrategyId <= sellStrategies.length);
        require(sellStrategyChakra[_sellStrategyId] == _chakra);

        uint256 sellStrategyIndex = _sellStrategyId.sub(1);
        SellStrategy storage sellStrategy = sellStrategies[sellStrategyIndex];
        sellStrategy.isActive = true;

        emit SellStrategyEnabled(_chakra, _sellStrategyId);
    }

    function enableBuyStrategy(
        address _chakra,
        uint256 _buyStrategyId
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        require(_buyStrategyId <= buyStrategies.length);
        require(buyStrategyChakra[_buyStrategyId] == _chakra);

        uint256 buyStrategyIndex = _buyStrategyId.sub(1);
        BuyStrategy storage buyStrategy = buyStrategies[buyStrategyIndex];
        buyStrategy.isActive = true;

        emit BuyStrategyEnabled(_chakra, _buyStrategyId);
    }

    function toChakra(
        address _chakra,
        address _baseToken,
        uint256 _poolAmount,
        uint256 _baseAmount,
        uint256 _buyStrategyId
    ) external payable revertIfPaused {
        require(_baseToken != address(0));
        require(isChakra[_chakra]);

        (
            bool isRelayer,
            address payable manager,
            address strategyBaseToken,
            uint256 strategyBaseAmount
        ) = isRelayerBuying(_chakra, _baseToken, _buyStrategyId);

        // if sender is relayer, amount to trade is the amount specified in strategy
        // otherwise can be overwritten from function arg
        uint256 baseAmount = isRelayer ? strategyBaseAmount : _baseAmount;
        // same for baseToken
        address baseToken = isRelayer ? strategyBaseToken : _baseToken;

        // this function below should return totalBaseAmount + fee in case sender relayer // split this out
        uint256 requiredTotalBaseAmount = calcToChakra(_chakra, baseToken, _poolAmount);

        // Relayer fee
        uint256 relayerFee;

        if(isRelayer) {
            relayerFee = requiredTotalBaseAmount.mul(300).div(10000);
        }

        // The baseAmount must be at least as much as the calculated requiredTotalBaseAmount to fill the chakra.
        // This checks that the relayer is not trying to spent more of the chakra owners funds than approved.
        // It also checks that if the chakra owner is trying to do a buy they are not sending too little to fill
        // the requested number of pool tokens.
        require(baseAmount >= requiredTotalBaseAmount.add(relayerFee));

        require(IERC20(baseToken).transferFrom(manager, address(this), baseAmount));

        // If the caller is a relayer then we need to check that they are not under spending on the chakra owners behalf
        // (buying too little pool tokens).
        if (isRelayer) {
            require(requiredTotalBaseAmount.mul(95).div(100) < baseAmount);

            IERC20(baseToken).transfer(msg.sender, relayerFee);
        }

        _toChakra(_chakra, baseToken, _poolAmount);

        // Transfer pool tokens to chakra manager
        IERC20 chakra = IERC20(_chakra);

        IERC20(chakra).transfer(manager, chakra.balanceOf(address(this)));
    }

    struct FromChakraArg {
        address _chakra;
        address _sellToken;
        uint256 _sellStrategyId;
        uint256 _sellTokenIndex;
        uint256 _poolAmount;
        uint256 _minQuoteToken;
    }

    struct FromChakraLocalVar {
        address payable manager;
        address strategySellToken;
        address sellToken;
        uint256 strategySellAmount;
        uint256 sellAmount;
        uint256 totalAmount;
        uint256 relayerFee;
        bool isRelayer;
    }

    function fromChakra(
        FromChakraArg calldata _arg
    ) external revertIfPaused {
        require(isChakra[_arg._chakra]);
        require(_arg._sellToken != address(0));

        FromChakraLocalVar memory vars;

        (
            vars.isRelayer,
            vars.manager,
            vars.strategySellToken,
            vars.strategySellAmount
        ) = isRelayerSelling(_arg._chakra, _arg._sellToken, _arg._sellStrategyId, _arg._sellTokenIndex);

        // if sender is relayer, amount to trade is the amount specified in strategy
        // otherwise can be overwritten from function arg
        vars.sellAmount = vars.isRelayer ? vars.strategySellAmount : _arg._minQuoteToken;
        // same for sellToken
        vars.sellToken = vars.isRelayer ? vars.strategySellToken : _arg._sellToken;

        vars.totalAmount = calcToChakra(_arg._chakra, vars.sellToken, _arg._poolAmount);

        // Relayer fee
        uint256 relayerFee;

        if(vars.isRelayer) {
            relayerFee = vars.totalAmount.mul(300).div(10000);
        }

        require(vars.sellAmount <= vars.totalAmount);

        IPSmartPool chakra = IPSmartPool(_arg._chakra);

        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_arg._chakra).calcTokensForAmount(_arg._poolAmount);
        chakra.transferFrom(msg.sender, address(this), _arg._poolAmount);
        chakra.exitPool(_arg._poolAmount);

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(address(UNISWAP_FACTORY), tokens[i], vars.sellToken);
            uint256 tokenAmountOut = UniLib.getAmountOut(amounts[i], reserveA, reserveB);
            IUniswapV2Exchange pair = IUniswapV2Exchange(
                UniLib.pairFor(address(UNISWAP_FACTORY), tokens[i], vars.sellToken)
            );

            // Uniswap V2 does not pull the token
            IERC20(tokens[i]).transfer(address(pair), amounts[i]);

            if (token0Or1(vars.sellToken, tokens[i]) == 0) {
                pair.swap(0, tokenAmountOut, address(this), new bytes(0));
            } else {
                pair.swap(tokenAmountOut, 0, address(this), new bytes(0));
            }
        }

        if(vars.isRelayer) {
            vars.totalAmount = vars.totalAmount.sub(vars.relayerFee);
            IERC20(vars.sellToken).transfer(msg.sender, vars.relayerFee);
        }

        IERC20(vars.sellToken).transfer(vars.manager, vars.totalAmount);
    }

    function saveEth() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function saveToken(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    function fromChakra(
        address _chakra,
        address _sellToken,
        uint256 _poolAmountOut
    ) external view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmountOut);

        uint256 totalQuoteAmount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(address(UNISWAP_FACTORY), tokens[i], _sellToken);
            totalQuoteAmount += UniLib.getAmountOut(amounts[i], reserveA, reserveB);
        }

        return totalQuoteAmount;
    }

    function getChakras() external view returns (address[] memory) {
        return chakras;
    }

    function getSellStrategies() external view returns (SellStrategy[] memory) {
        return sellStrategies;
    }

    function getBuyStrategies() external view returns (BuyStrategy[] memory) {
        return buyStrategies;
    }

    function token0Or1(address tokenA, address tokenB) internal view returns (uint256) {
        (address token0, address token1) = UniLib.sortTokens(tokenA, tokenB);

        if (token0 == tokenB) {
            return 0;
        }

        return 1;
    }

    function _toChakra(
        address _chakra,
        address _baseToken,
        uint256 _poolAmount
    ) internal {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmount);

        for (uint256 i = 0; i < tokens.length; i++) {
            if (isChakra[tokens[i]]) {
                _toChakra(tokens[i], _baseToken, amounts[i]);
            } else {
                IUniswapV2Exchange pair = IUniswapV2Exchange(
                    UniLib.pairFor(address(UNISWAP_FACTORY), tokens[i], _baseToken)
                );

                (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
                    address(UNISWAP_FACTORY),
                    _baseToken,
                    tokens[i]
                );
                uint256 amountIn = UniLib.getAmountIn(amounts[i], reserveA, reserveB);

                // UniswapV2 does not pull the token
                IERC20(_baseToken).transfer(address(pair), amountIn);

                if (token0Or1(_baseToken, tokens[i]) == 0) {
                    pair.swap(amounts[i], 0, address(this), new bytes(0));
                } else {
                    pair.swap(0, amounts[i], address(this), new bytes(0));
                }
            }

            IERC20(tokens[i]).safeApprove(_chakra, amounts[i]);
        }

        IPSmartPool smartPool = IPSmartPool(_chakra);
        smartPool.joinPool(_poolAmount);
    }

    function isRelayerBuying(
        address _chakra,
        address _baseToken,
        uint256 _buyStrategyId
    )
        internal
        returns (
            bool,
            address payable,
            address,
            uint256
        )
    {
        address payable manager = payable(chakraManager[_chakra]);
        address strategyBaseToken;
        uint256 strategyBaseAmount;
        bool isRelayer = msg.sender != manager;

        if (isRelayer) {
            require(buyStrategyChakra[_buyStrategyId] == _chakra);
            BuyStrategy storage buyStrategy = buyStrategies[_buyStrategyId];

            require(buyStrategy.isActive);
            require(buyStrategy.buyToken == _baseToken);
            require(
                buyStrategy.lastBuyTimestamp.add(buyStrategy.interBuyDelay) <= now
            );

            buyStrategy.lastBuyTimestamp = now;
            strategyBaseAmount = buyStrategy.buyAmount;
            strategyBaseToken = buyStrategy.buyToken;
        }

        return (isRelayer, manager, strategyBaseToken, strategyBaseAmount);
    }

    function isRelayerSelling(
        address _chakra,
        address _sellToken,
        uint256 _sellStrategyId,
        uint256 _tokenIndex
    ) internal returns (
            bool,
            address payable,
            address,
            uint256
        ) {
        address payable manager = payable(chakraManager[_chakra]);
        address strategySellToken;
        uint256 strategySellAmount;
        bool isRelayer = msg.sender != manager;

        SellStrategy storage sellStrategy = sellStrategies[_sellStrategyId];

        if (isRelayer) {
            require(sellStrategyChakra[_sellStrategyId] == _chakra);

            require(sellStrategy.isActive);
            require(_tokenIndex < sellStrategy.sellTokens.length);
            require(sellStrategy.sellTokens[_tokenIndex] == _sellToken);
            require(!sellStrategy.isExecuted[_tokenIndex]);

            strategySellToken = sellStrategy.sellTokens[_tokenIndex];
            strategySellAmount = sellStrategy.prices[_tokenIndex];
        }

        sellStrategy.isExecuted[_tokenIndex] = true;

        return (isRelayer, manager, strategySellToken, strategySellAmount);
    }
}
