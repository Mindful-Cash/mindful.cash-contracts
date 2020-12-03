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

    /// @dev uniswap factory address
    IUniswapV2Factory constant UNISWAP_FACTORY = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);

    /// @dev sell strategy data struct
    struct SellStrategy {
        string name;                                                    // strategy name
        uint256 id;                                                     // strategy id
        uint256[] prices;                                               // price threshold
        address[] sellTokens;                                           // token to sell to for each price point
        bool[] isExecuted;                                              // is sell trade already executed
        bool isActive;                                                  // is this strategy activated
    }

    /// @dev buy strategy data struct
    struct BuyStrategy {
        string name;                                                    // startegy name
        uint256 id;                                                     // strategy id
        uint256 interBuyDelay;                                          // time interval between each buy
        uint256 buyAmount;                                              // buy amount     
        uint256 lastBuyTimestamp;                                       // last buy trade timestamp
        address buyToken;                                               // buy token
        bool isActive;                                                  // is this strategy activated
    }

    /// @notice balance factory instance
    IBFactory public balancerFactory;

    /// @notice smart pool implementation address
    address public smartPoolImplementation;

    /// @notice is mindful proxy paused
    bool public isPaused;

    /// @notice mapping of chakra
    mapping(address => bool) public isChakra;
    /// @notice mapping between chakra and manager address
    mapping(address => address) public chakraManager;
    /// @notice mapping between sell strategy id and chakra (strategy id = index in strategies array)
    mapping(uint256 => address) public sellStrategyChakra;
    /// @notice mapping between buy strategy id and chakra (strategy id = index in strategies array)
    mapping(uint256 => address) public buyStrategyChakra;

    /// @notice array of chakras
    address[] public chakras;
    /// @notice array of sell strategies
    SellStrategy[] public sellStrategies;
    /// @notice array of buy strategies
    BuyStrategy[] public buyStrategies;

    /**
     * @notice constructor
     */
    constructor() public {
        // set current Mindful owner to msg.sender
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

    /**
     * @dev pauzer
     */
    modifier revertIfPaused {
        if (isPaused) {
            revert();
        } else {
            _;
        }
    }

    /**
     * @dev modifier to check if _sender is _chakra manager
     * @param _chakra chakra address
     * @param _sender sender address
     */
    modifier onlyChakraManager(address _chakra, address _sender) {
        require(chakraManager[_chakra] == _sender);

        _;
    }

    /**
     * @notice set smart pool implementation address
     * @dev can only be called by owner
     * @param _implementation implementation address
     */
    function setImplementation(address _implementation) external onlyOwner {
        smartPoolImplementation = _implementation;
    }

    /**
     * @notice save all stucked ETH
     * @dev can only be called by owner. Send all Mindful proxy ETH balance to msg.sender
     */
    function saveEth() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    /**
     * @notice save all stucked token
     * @dev can only be called by owner. Send all Mindful proxy token balance to msg.sender
     * @param _token token address
     */
    function saveToken(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    /**
     * @notice create a sell strategy
     * @dev only chakra manager can add a sell strategy in specific chakra address
     * @param _chakra chakra address
     * @param _name startegy name
     * @param _sellTokens array of tokens to sell to
     * @param _prices sell target prices
     */
    function addSellStrategy(
        address _chakra,
        string calldata _name,
        address[] calldata _sellTokens,
        uint256[] calldata _prices
    ) external onlyChakraManager(_chakra, msg.sender) {
        // check if _chakra address is a legit chakra
        require(isChakra[_chakra]);
        // check if tokens and prices array's length are equal
        require(_prices.length == _sellTokens.length);

        // init prices array
        uint256[] memory prices = new uint256[](_prices.length);
        // init tokens array
        address[] memory sellTokens = new address[](_prices.length);
        // init isExecuted array
        bool[] memory isExecuted = new bool[](_prices.length);

        // loop through prices array arg
        for (uint256 i = 0; i < _prices.length; i++) {
            // check if price is valid
            require(_prices[i] > 0);
            // check if token address is valid
            require(_sellTokens[i] != address(0));

            // set sell price, token and mark it as not-executed yet
            prices[i] = _prices[i];
            sellTokens[i] = _sellTokens[i];
            isExecuted[i] = false;
        }

        // get new sell strategy id
        uint256 sellStrategyId = sellStrategies.length.add(1);
        // init SellStrategy
        SellStrategy memory sellStrategy = SellStrategy(_name, sellStrategyId, prices, sellTokens, isExecuted, true);
        // map sell strategy id by chakra address
        sellStrategyChakra[sellStrategyId] = _chakra;
        // store sell startegy in sell strategies array
        sellStrategies.push(sellStrategy);

        emit SellStrategyAdded(_chakra, _name, sellStrategyId);
    }

    /**
     * @notice create a buy strategy
     * @dev only chakra manager can add a buy strategy in specific chakra address
     * @param _chakra chakra address
     * @param _buyToken DCA in token
     * @param _name buy strategy name
     * @param _interBuyDelay time interval between each buy
     * @param _buyAmount amount to buy
     */
    function addBuyStrategy(
        address _chakra,
        address _buyToken,
        string calldata _name,
        uint256 _interBuyDelay,
        uint256 _buyAmount
    ) external onlyChakraManager(_chakra, msg.sender) {
        // check if _chakra address is a legit chakra
        require(isChakra[_chakra]);
        // check if _interBuyDelay is valid interval
        require(_interBuyDelay > 0);   
        // check if _buyAmount is valid amount  
        require(_buyAmount > 0); 
        // check if _buyToken is valid address
        require(_buyToken != address(0)); 

        // create staregy
        uint256 buyStrategyId = buyStrategies.length.add(1); 
        BuyStrategy memory buyStrategy = BuyStrategy(_name, buyStrategyId, _interBuyDelay, _buyAmount, uint256(0), _buyToken, true);
        // map buy strategy by chakra
        buyStrategyChakra[buyStrategyId] = _chakra;
        // store buy strategy into buy strategies array
        buyStrategies.push(buyStrategy);

        emit BuyStrategyAdded(_chakra, _name, buyStrategyId);
    }

    function updateBuyStartegy(
        address _chakra,
        address _buyToken,
        uint256 _buyStrategyId,
        uint256 _InterBuyDelay,
        uint256 _buyAmount,
        bool _isActive
    ) external onlyChakraManager(_chakra, msg.sender) {
        require(isChakra[_chakra]);
        require(_buyStrategyId <= buyStrategies.length);
        require(buyStrategyChakra[_buyStrategyId] == _chakra);
        require(_buyToken != address(0));
        require(_buyAmount > 0);
        require(_InterBuyDelay > 0);

        uint256 buyStrategyIndex = _buyStrategyId.sub(1);
        BuyStrategy storage buyStrategy = buyStrategies[buyStrategyIndex];

        buyStrategy.buyToken = _buyToken;
        buyStrategy.buyAmount = _buyAmount;
        buyStrategy.interBuyDelay = _InterBuyDelay;
        buyStrategy.isActive = _isActive;

        emit BuyStrategyUpdated(_chakra, _buyStrategyId);
    }


    // struct SellStrategy {
    //     string name;
    //     uint256 id;
    //     uint256[] prices; // price threshold
    //     address[] sellTokens; // token to sell to for each price point
    //     bool[] isExecuted;
    //     bool isActive; // chakra manager can disable strategy
    // }
    
    // function updateSellStrategy(
    //     address _chakra,
    //     uint256 _sellStrategyId,
    //     address[] calldata _sellTokens,	
    //     uint256[] calldata _prices
    // ) external onlyChakraManager(_chakra, msg.sender) {
    // }

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
        address sellToken;
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
            vars.sellToken,
            vars.sellAmount
        ) = isRelayerSelling(_arg._chakra, _arg._sellToken, _arg._sellStrategyId, _arg._sellTokenIndex);

        // if sender is relayer, amount to trade is the amount specified in strategy
        // otherwise can be overwritten from function arg
        vars.sellAmount = vars.isRelayer ? vars.sellAmount : _arg._minQuoteToken;
        // same for sellToken
        vars.sellToken = vars.isRelayer ? vars.sellToken : _arg._sellToken;

        vars.totalAmount = calcToChakra(_arg._chakra, vars.sellToken, _arg._poolAmount);

        require(vars.sellAmount <= vars.totalAmount);

        // Relayer fee
        uint256 relayerFee;

        if(vars.isRelayer) {
            relayerFee = vars.totalAmount.mul(300).div(10000);
        }

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

    function togglePause() public onlyOwner {
        isPaused = !isPaused;
    }

    // function die() public onlyOwner {
    //   address payable _to = payable(los().owner);
    //   selfdestruct(_to);
    // }

    function init(address _balancerFactory, address _implementation) public {
        require(smartPoolImplementation == address(0));
        _setOwner(msg.sender);
        balancerFactory = IBFactory(_balancerFactory);

        smartPoolImplementation = _implementation;
    }

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
        address _currency,
        uint256 _poolAmount
    ) public view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmount);

        uint256 totalBaseAmount = 0;
        uint256 relayerFee;

        for (uint256 i = 0; i < tokens.length; i++) {
            // enable recursive chakras
            if (isChakra[tokens[i]]) {
                uint256 internalTotalBaseAmount = calcToChakra(tokens[i], _currency, amounts[i]);
                totalBaseAmount += internalTotalBaseAmount;
            } else {
                (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
                    address(UNISWAP_FACTORY),
                    _currency,
                    tokens[i]
                );
                totalBaseAmount += UniLib.getAmountIn(amounts[i], reserveA, reserveB);
            }
        }

        return totalBaseAmount;
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
                now >= buyStrategy.lastBuyTimestamp.add(buyStrategy.interBuyDelay)
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

    function token0Or1(address tokenA, address tokenB) internal view returns (uint256) {
        (address token0, address token1) = UniLib.sortTokens(tokenA, tokenB);

        if (token0 == tokenB) {
            return 0;
        }

        return 1;
    }
}
