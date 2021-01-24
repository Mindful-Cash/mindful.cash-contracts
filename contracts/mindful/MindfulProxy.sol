pragma solidity 0.6.4;

pragma experimental ABIEncoderV2;

import "./UniLib.sol";

import "../interfaces/IERC20.sol";
import "../interfaces/IUniswapV2Factory.sol";
import "../interfaces/IUniswapV2Exchange.sol";
import "../interfaces/IPSmartPool.sol";
import "../interfaces/IPProxiedFactory.sol";

import "../libraries/LibSafeApprove.sol";

import "../Ownable.sol";

contract MindfulProxy is Ownable {
    using SafeMath for uint256;
    using LibSafeApprove for IERC20;

    /// @dev uniswap factory address
    IUniswapV2Factory constant UNISWAP_FACTORY = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);

    /// @dev sell strategy data struct
    struct SellStrategy {
        string name; // strategy name
        uint256 id; // strategy id
        uint256[] prices; // price threshold
        address[] sellTokens; // token to sell to for each price point
        bool[] isExecuted; // is sell trade already executed
        bool isActive; // is this strategy activated
    }

    /// @dev buy strategy data struct
    struct BuyStrategy {
        string name; // strategy name
        uint256 id; // strategy id
        uint256 interBuyDelay; // time interval between each buy
        uint256 buyAmount; // buy amount
        uint256 lastBuyTimestamp; // last buy trade timestamp
        address buyToken; // buy token
        bool isActive; // is this strategy activated
    }

    /// @notice PProxied Factory to deploy smart proxied pools.
    IPProxiedFactory public pProxiedFactory;

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
    event SellStrategyUpdated(address indexed chakra, uint256 indexed sellStrategyId, uint256 indexed sellTokenIndex, uint256 oldPrice, uint256 newPrice, bool wasActive, bool isActive);
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
     * @param _name strategy name
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
        // store sell strategy in sell strategies array
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
        BuyStrategy memory buyStrategy = BuyStrategy(
            _name,
            buyStrategyId,
            _interBuyDelay,
            _buyAmount,
            uint256(0),
            _buyToken,
            true
        );
        // map buy strategy by chakra
        buyStrategyChakra[buyStrategyId] = _chakra;
        // store buy strategy into buy strategies array
        buyStrategies.push(buyStrategy);

        emit BuyStrategyAdded(_chakra, _name, buyStrategyId);
    }

    /**
     * @notice update buy strategy
     * @dev only chakra manager can update buy strategy
     * @param _chakra chakra address
     * @param _buyToken DCA in token
     * @param _buyStrategyId buy strategy id
     * @param _interBuyDelay time interval between each buy
     * @param _buyAmount amount to buy
     * @param _isActive to disable strategy, set to false
     */
    function updateBuyStrategy(
        address _chakra,
        address _buyToken,
        uint256 _buyStrategyId,
        uint256 _interBuyDelay,
        uint256 _buyAmount,
        bool _isActive
    ) external onlyChakraManager(_chakra, msg.sender) {
        // check if _chakra address is a legit chakra
        require(isChakra[_chakra]);
        // check if _buyToken is valid address
        require(_buyToken != address(0));
        // check if buy strategy id is valid
        require(_buyStrategyId <= buyStrategies.length);
        // check that buy strategy passed as arg map to correct chakra address
        require(buyStrategyChakra[_buyStrategyId] == _chakra);
        // check if _buyAmount is valid amount
        require(_buyAmount > 0);
        // check if _interBuyDelay is valid interval
        require(_interBuyDelay > 0);

        // get strategy index & load strategy
        BuyStrategy storage buyStrategy = buyStrategies[_buyStrategyId.sub(1)];

        // update strategy data
        buyStrategy.buyToken = _buyToken;
        buyStrategy.buyAmount = _buyAmount;
        buyStrategy.interBuyDelay = _interBuyDelay;
        buyStrategy.isActive = _isActive;

        emit BuyStrategyUpdated(_chakra, _buyStrategyId);
    }

    /** 
     * @notice update a specific sell strategy for a specific sell token
     * @dev only price and strategy status can be updated
     * @param _chakra chakra address
     * @param _sellStrategyId sell strategy id
     * @param _sellTokenIndex sell token index in SellStrategy.sellTokens array
     * @param _price new selling price
     * @param _isActive set to false to deactivate strategy
     */
    function updateSellStrategy(
        address _chakra,
        uint256 _sellStrategyId,
        uint256 _sellTokenIndex,
        uint256 _price,
        bool _isActive
    ) external onlyChakraManager(_chakra, msg.sender) {
        // check if _chakra address is a legit chakra
        require(isChakra[_chakra]);
        // check if buy strategy id is valid
        require(_sellStrategyId <= sellStrategies.length);

        // get sell strategy 
        SellStrategy storage sellStrategy = sellStrategies[_sellStrategyId];

        // check if sell token to update exist
        require(_sellTokenIndex < sellStrategy.sellTokens.length);

        emit SellStrategyUpdated(_chakra, _sellStrategyId, _sellTokenIndex, sellStrategy.prices[_sellTokenIndex], _price, sellStrategy.isActive, _isActive);

        sellStrategy.prices[_sellTokenIndex] = _price;
        sellStrategy.isActive = _isActive;
    }

    /// @dev a struct for toChakra() arguments
    struct ToChakraArg {
        address chakra;
        address baseToken;
        uint256 buyStrategyId;
        uint256 poolAmount;
        uint256 baseAmount;
    }

    /// @dev a struct for toChakra() local variables
    struct ToChakraLocalVar {
        address payable manager;
        address strategyBaseToken;
        uint256 strategyBaseAmount;
        uint256 relayerFee;
        bool isRelayer;
    }

    /**
     * @notice DCA in
     */
    function toChakra(ToChakraArg calldata _arg) external payable revertIfPaused {
        require(_arg.baseToken != address(0));
        require(isChakra[_arg.chakra]);

        ToChakraLocalVar memory vars;

        (vars.isRelayer, vars.manager, vars.strategyBaseToken, vars.strategyBaseAmount) = isRelayerBuying(
            _arg.chakra,
            _arg.baseToken,
            _arg.buyStrategyId
        );

        // if sender is relayer, amount to trade is the amount specified in strategy
        // otherwise can be overwritten from function arg
        vars.strategyBaseAmount = vars.isRelayer ? vars.strategyBaseAmount : _arg.baseAmount;
        // same for baseToken
        vars.strategyBaseToken = vars.isRelayer ? vars.strategyBaseToken : _arg.baseToken;

        // this function below should return totalBaseAmount + fee in case sender relayer // split this out
        uint256 requiredTotalBaseAmount = calcToChakra(_arg.chakra, vars.strategyBaseToken, _arg.poolAmount);

        // Relayer fee
        if (vars.isRelayer) {
            vars.relayerFee = requiredTotalBaseAmount.mul(3).div(100);
        }

        // The baseAmount must be at least as much as the calculated requiredTotalBaseAmount to fill the chakra.
        // This checks that the relayer is not trying to spent more of the chakra owners funds than approved.
        // It also checks that if the chakra owner is trying to do a buy they are not sending too little to fill
        // the requested number of pool tokens.

        require(vars.strategyBaseAmount >= requiredTotalBaseAmount.add(vars.relayerFee));

        require(IERC20(vars.strategyBaseToken).transferFrom(vars.manager, address(this), vars.strategyBaseAmount));

        // If the caller is a relayer then we need to check that they are not under spending on the chakra owners behalf
        // (buying too little pool tokens).
        if (vars.isRelayer) {
            require(requiredTotalBaseAmount.mul(95).div(100) < vars.strategyBaseAmount);

            IERC20(vars.strategyBaseToken).transfer(msg.sender, vars.relayerFee);
        }

        _toChakra(_arg.chakra, vars.strategyBaseToken, _arg.poolAmount);

        // Transfer pool tokens to chakra manager
        IERC20 chakra = IERC20(_arg.chakra);

        IERC20(chakra).transfer(vars.manager, chakra.balanceOf(address(this)));
    }

    /// @dev a struct for fromChakra() arguments
    struct FromChakraArg {
        address _chakra;
        address _sellToken;
        uint256 _sellStrategyId;
        uint256 _sellTokenIndex;
        uint256 _poolAmount;
        uint256 _minQuoteToken;
    }

    /// @dev a struct for fromCHakra() local variables
    struct FromChakraLocalVar {
        address payable manager;
        address sellToken;
        uint256 sellAmount;
        uint256 totalAmount;
        uint256 relayerFee;
        bool isRelayer;
    }

    function fromChakra(FromChakraArg calldata _arg) external revertIfPaused {
        require(isChakra[_arg._chakra]);
        require(_arg._sellToken != address(0));

        FromChakraLocalVar memory vars;

        (vars.isRelayer, vars.manager, vars.sellToken, vars.sellAmount) = isRelayerSelling(
            _arg._chakra,
            _arg._sellToken,
            _arg._sellStrategyId,
            _arg._sellTokenIndex
        );

        // if sender is relayer, amount to trade is the amount specified in strategy
        // otherwise can be overwritten from function arg
        vars.sellAmount = vars.isRelayer ? vars.sellAmount : _arg._minQuoteToken;
        // same for sellToken
        vars.sellToken = vars.isRelayer ? vars.sellToken : _arg._sellToken;

        vars.totalAmount = calcToChakra(_arg._chakra, vars.sellToken, _arg._poolAmount);

        require(vars.sellAmount <= vars.totalAmount);

        // Relayer fee
        if (vars.isRelayer) {
            vars.relayerFee = vars.totalAmount.mul(3).div(100);
        }

        IPSmartPool chakra = IPSmartPool(_arg._chakra);

        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_arg._chakra).calcTokensForAmount(
            _arg._poolAmount
        );
        chakra.transferFrom(msg.sender, address(this), _arg._poolAmount);
        chakra.exitPool(_arg._poolAmount);

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
                address(UNISWAP_FACTORY),
                tokens[i],
                vars.sellToken
            );
            uint256 tokenAmountOut = UniLib.getAmountOut(amounts[i], reserveA, reserveB);
            IUniswapV2Exchange pair = IUniswapV2Exchange(
                UniLib.pairFor(address(UNISWAP_FACTORY), tokens[i], vars.sellToken)
            );

            // Uniswap V2 does not pull the token
            IERC20(tokens[i]).transfer(address(pair), amounts[i]);

            // NOTE: this code requires that there is a uniswap market between the baseToken and the exiting sell token.
            if (token0Or1(vars.sellToken, tokens[i]) == 0) {
                pair.swap(0, tokenAmountOut, address(this), new bytes(0));
            } else {
                pair.swap(tokenAmountOut, 0, address(this), new bytes(0));
            }
        }

        if (vars.isRelayer) {
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

    function init(address _pProxiedFactory,address _balancerFactory, address _implementation) public {
        require(_pProxiedFactory != address(0),"invalid pProxiedFactory");
        _setOwner(msg.sender);
        pProxiedFactory = IPProxiedFactory(_pProxiedFactory);
        pProxiedFactory.init(_balancerFactory,_implementation);
    }

    function deployChakra(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        address[] memory _tokens,
        uint256[] memory _amounts,
        uint256[] memory _weights,
        uint256 _cap
    ) public revertIfPaused returns (address) {
        // approve pProxiedFactory 
        // Deploy proxy contract
        address smartPool = pProxiedFactory.newProxiedSmartPool(
            msg.sender,
            _name,
            _symbol,
            _initialSupply,
            _tokens,
            _amounts,
            _weights,
            _cap
        );

        isChakra[address(smartPool)] = true;
        chakraManager[address(smartPool)] = msg.sender;
        chakras.push(address(smartPool));

        emit SmartPoolCreated(address(smartPool), msg.sender, _name, _symbol);

        IERC20(smartPool).transfer(msg.sender, _initialSupply);

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
            require(now >= buyStrategy.lastBuyTimestamp.add(buyStrategy.interBuyDelay));

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
