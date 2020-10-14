pragma solidity ^0.6.4;

import "./UniLib.sol";

import "@pie-dao/proxy/contracts/PProxyPausable.sol";

import "../interfaces/IBFactory.sol";
import "../interfaces/IBPool.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "../interfaces/IUniswapV2Exchange.sol";
import "../interfaces/IWETH.sol";
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
    IWETH public constant WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    struct SellStrategy {
        uint256 id;
        uint256[] prices; // price threshold
        address[] sellTokens; // token to sell to for each price point
        bool[] isExecuted;
        bool isActive; // chakra manager can disable strategy
    }

    struct BuyStrategy {
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
    mapping(address => address payable) public chakraManager;
    /// @notice mapping of chakra
    mapping(address => bool) public isChakra;
    // mapping between sell strategy id and chakra (strategy id = index in strategies array)
    mapping(uint256 => address) public sellStrategyChakra;
    // mapping between buy strategy id and chakra (strategy id = index in strategies array))
    mapping(uint256 => address) public buyStrategyChakra;

    // when create a new sell or buy strategy, id = sell or buy strategy array.length+1
    // save id into sellStrategyChakra or buyStrategyChakra mapping

    address[] public chakras;
    SellStrategy[] public sellStrategies;
    BuyStrategy[] public buyStrategies;

    constructor() public {
        _setOwner(msg.sender);
    }

    event SmartPoolCreated(address indexed poolAddress, address indexed chakraManager, string name, string symbol);
    event BuyStrategyAdded(address indexed chakra, uint256 indexed buyStrategyId);
    event SellStrategyAdded(address indexed chakra, uint256 indexed sellStrategyId);
    event BuyStrategyDisabled(address indexed chakra, uint256 indexed buyStrategyId);
    event SellStrategyDisabled(address indexed chakra, uint256 indexed buyStrategyId);

    // Pauzer
    modifier revertIfPaused {
        if (isPaused) {
            revert("[UniswapV2Recipe] is Paused");
        } else {
            _;
        }
    }

    modifier onlyChakraManager(address _sender, address _chakra) {
        require(chakraManager[_chakra] == _sender, "Sender is not chakra manager");

        _;
    }

    function init(address _balancerFactory, address _implementation) public {
        require(smartPoolImplementation == address(0), "Already initialised");
        _setOwner(msg.sender);
        balancerFactory = IBFactory(_balancerFactory);

        smartPoolImplementation = _implementation;
    }

    function togglePause() public onlyOwner {
        isPaused = !isPaused;
    }


    function setImplementation(address _implementation) external onlyOwner {
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

    function addSellStrategy(
        address _chakra,
        uint256[] calldata _prices,
        address[] calldata _sellTokens
    ) external onlyChakraManager(msg.sender, _chakra) {
        require(_prices.length == _sellTokens.length, "Invalid sell strategy arrays");

        uint256[] memory prices;
        address[] memory sellTokens;
        bool[] memory isExecuted;

        for (uint256 i = 0; i < _prices.length; i++) {
            require(_prices[i] > 0, "Invalid sell strategy price");
            // should we check if _sellTokens[i] is in chakra ?
            require(_sellTokens[i] != address(0), "Invalid sell strategy token");

            prices[i] = _prices[i];
            sellTokens[i] = _sellTokens[i];
            isExecuted[i] = true;
        }

        uint256 sellStrategyId = sellStrategies.length.add(1);
        SellStrategy memory sellStrategy = SellStrategy(sellStrategyId, prices, sellTokens, isExecuted, true);
        sellStrategyChakra[sellStrategyId] = _chakra;
        sellStrategies.push(sellStrategy);

        emit SellStrategyAdded(_chakra, sellStrategyId);
    }

    function disableSellStrategy(
        address _chakra,
        uint256 _sellStrategyId
    ) external onlyChakraManager(msg.sender, _chakra) {
        require(_sellStrategyId <= buyStrategies.length, "Invalid sell strategy id");
        require(sellStrategyChakra[_sellStrategyId] == _chakra, "Sell strategy id does not belong to specified chakra");

        SellStrategy storage sellStrategy = sellStrategies[_sellStrategyId];
        sellStrategy.isActive = false;

        emit SellStrategyDisabled(_chakra, _sellStrategyId);
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
        address payable manager = chakraManager[_chakra];
        address strategyBaseToken;
        uint256 strategyBaseAmount;
        bool isRelayer = msg.sender != manager;

        if (isRelayer) {
            require(buyStrategyChakra[_buyStrategyId] == _chakra, "Invalid strategy id for chakra");
            BuyStrategy storage buyStrategy = buyStrategies[_buyStrategyId];

            require(buyStrategy.isActive, "Strategy is not active");
            require(buyStrategy.buyToken == _baseToken, "Buy token mismatch");
            require(
                buyStrategy.lastBuyTimestamp.add(buyStrategy.interBuyDelay) <= now,
                "Can not buy during active delay"
            );

            buyStrategy.lastBuyTimestamp = now;
            strategyBaseAmount = buyStrategy.buyAmount;
            strategyBaseToken = buyStrategy.buyToken;
        }

        return (isRelayer, manager, strategyBaseToken, strategyBaseAmount);
    }

    function isRelayerSelling() internal {}

    function toChakra(
        address _chakra,
        address _baseToken,
        uint256 _poolAmount,
        uint256 _baseAmount,
        uint256 _buyStrategyId
    ) external payable revertIfPaused {
        require(_baseToken != address(0), "Invalid base token");
        require(isChakra[_chakra], "Not a Chakra");

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

        // this function below should return totalBaseAmount + fee in case sender relayer
        uint256 requiredTotalBaseAmount = calcToChakra(_chakra, baseToken, _poolAmount, isRelayer);

        // The baseAmount must be at least as much as the calculated requiredTotalBaseAmount to fill the chakra.
        // This checks that the relayer is not trying to spent more of the chakra owners funds than approved.
        // It also checks that if the chakra owner is trying to do a buy they are not sending too little to fill
        // the requested number of pool tokens.
        require(baseAmount >= requiredTotalBaseAmount, "Base currency amount too low");

        // If the caller is a relayer then we need to check that they are not under spending on the chakra owners behalf
        // (buying too little pool tokens).
        if (isRelayer) {
            require(requiredTotalBaseAmount.mul(100).div(95) > baseAmount, "Pool token amount too low");
        }

        require(IERC20(baseToken).transferFrom(manager, address(this), baseAmount), "Transfer from manager failed");

        _toChakra(_chakra, baseToken, _poolAmount);

        // Transfer pool tokens to chakra manager
        IERC20 chakra = IERC20(_chakra);

        IERC20(chakra).transfer(manager, chakra.balanceOf(address(this)));
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

    // todod: add isRelayer param, add fee calculation, return fee equal to zero if isRelayer = false
    function calcToChakra(
        address _chakra,
        address _curreny,
        uint256 _poolAmount,
        bool isRelayer
    ) public view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmount);

        uint256 totalBaseAmount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            // enable recursive chakras
            if (isChakra[tokens[i]]) {
                totalBaseAmount += calcToChakra(tokens[i], _curreny, amounts[i], isRelayer);
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

    // add same mechanism to toChakra
    function fromChakra(
        address _chakra,
        address _quoteToken,
        uint256 _poolAmount,
        uint256 _minQuoteToken
    ) external revertIfPaused {
        bool isRelayer = false;
        uint256 totalAmount = calcToChakra(_chakra, _quoteToken, _poolAmount, isRelayer);

        require(_minQuoteToken <= totalAmount, "Output currency amount too low");

        IPSmartPool chakra = IPSmartPool(_chakra);

        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmount);
        chakra.transferFrom(msg.sender, address(this), _poolAmount);
        chakra.exitPool(_poolAmount);

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(address(UNISWAP_FACTORY), tokens[i], _quoteToken);
            uint256 tokenAmountOut = UniLib.getAmountOut(amounts[i], reserveA, reserveB);
            IUniswapV2Exchange pair = IUniswapV2Exchange(
                UniLib.pairFor(address(UNISWAP_FACTORY), tokens[i], _quoteToken)
            );

            // Uniswap V2 does not pull the token
            IERC20(tokens[i]).transfer(address(pair), amounts[i]);

            if (token0Or1(_quoteToken, tokens[i]) == 0) {
                pair.swap(0, tokenAmountOut, address(this), new bytes(0));
            } else {
                pair.swap(tokenAmountOut, 0, address(this), new bytes(0));
            }
        }

        if (_quoteToken == address(WETH)) {
            WETH.withdraw(totalAmount);
            msg.sender.transfer(address(this).balance);
        } else {
            IERC20(_quoteToken).transfer(msg.sender, totalAmount);
        }
    }

    function fromChakra(
        address _chakra,
        address _quoteToken,
        uint256 _poolAmountOut
    ) external view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra).calcTokensForAmount(_poolAmountOut);

        uint256 totalQuoteAmount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(address(UNISWAP_FACTORY), tokens[i], _quoteToken);
            totalQuoteAmount += UniLib.getAmountOut(amounts[i], reserveA, reserveB);
        }

        return totalQuoteAmount;
    }

    function token0Or1(address tokenA, address tokenB) internal view returns (uint256) {
        (address token0, address token1) = UniLib.sortTokens(tokenA, tokenB);

        if (token0 == tokenB) {
            return 0;
        }

        return 1;
    }

    // What is this !!
    // function die() public onlyOwner {
    //   address payable _to = payable(los().owner);
    //   selfdestruct(_to);
    // }

    function saveEth() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    function saveToken(address _token) external onlyOwner {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    function getChakras() external view returns (address[] memory) {
        return chakras;
    }
}
