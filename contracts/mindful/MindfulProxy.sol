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

    IUniswapV2Factory constant UNISWAP_FACTORY = IUniswapV2Factory(
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
    );
    // ISmartPoolRegistry public constant REGISTRY = ISmartPoolRegistry(
    //   0x412a5d5eC35fF185D6BfF32a367a985e1FB7c296
    // );
    IWETH public constant WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    IBFactory public balancerFactory;

    address public smartPoolImplementation;

    bool private isPaused = false;

    mapping(address => address) public poolManager;
    mapping(address => bool) public isPool;

    address[] public pools;

    function togglePause() public onlyOwner {
        isPaused = !isPaused;
    }

    constructor() public {
        _setOwner(msg.sender);
    }

    event SmartPoolCreated(
        address indexed poolAddress,
        address indexed poolManager,
        string name,
        string symbol
    );

    // Pauzer
    modifier revertIfPaused {
        if (isPaused) {
            revert("[UniswapV2Recipe] is Paused");
        } else {
            _;
        }
    }

    modifier onlyPoolManager(address _sender, address _bpool) {
        require(poolManager[_bpool] == _sender, "Sender is not pool manager");

        _;
    }

    function init(address _balancerFactory, address _implementation) public {
        require(smartPoolImplementation == address(0), "Already initialised");
        _setOwner(msg.sender);
        balancerFactory = IBFactory(_balancerFactory);

        smartPoolImplementation = _implementation;
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

        isPool[address(smartPool)] = true;
        poolManager[address(smartPool)] = msg.sender;
        pools.push(address(smartPool));

        emit SmartPoolCreated(address(smartPool), msg.sender, _name, _symbol);

        smartPool.transfer(msg.sender, _initialSupply);

        return address(smartPool);
    }

    // Max eth amount enforced by msg.value
    function toChakra(
        address _chakra,
        address _baseToken,
        uint256 _poolAmount,
        uint256 _baseAmount
    ) external payable revertIfPaused {
        require(_baseToken != address(0), "invalid");

        // require(registry.inRegistry(_chakra), "Not a Pie");
        require(isPool[_chakra], "Not a Chakra");

        uint256 totalBaseAmount = calcToChakra(_chakra, _baseToken, _poolAmount);

        if (_baseToken == address(WETH)) {
            require(
                (msg.value == _baseAmount) && (_baseAmount >= totalBaseAmount),
                "Base currency amount too low"
            );

            WETH.deposit{ value: totalBaseAmount }();

            // return excess ETH
            if (address(this).balance != 0) {
                // Send any excess ETH back
                msg.sender.transfer(address(this).balance);
            }
        } else {
            require(_baseAmount >= totalBaseAmount, "Base currency amount too low");

            require(IERC20(_baseToken).transferFrom(msg.sender, address(this), _baseAmount));
        }

        _toChakra(_chakra, _baseToken, _poolAmount);

        // Transfer pool tokens to msg.sender
        IERC20 pie = IERC20(_chakra);

        IERC20(pie).transfer(msg.sender, pie.balanceOf(address(this)));
    }

    function _toChakra(
        address _chakra,
        address _baseToken,
        uint256 _poolAmount
    ) internal {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra)
            .calcTokensForAmount(_poolAmount);

        for (uint256 i = 0; i < tokens.length; i++) {
            if (isPool[tokens[i]]) {
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

        IPSmartPool pie = IPSmartPool(_chakra);
        pie.joinPool(_poolAmount);
    }

    function calcToChakra(
        address _chakra,
        address _curreny,
        uint256 _poolAmount
    ) public view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra)
            .calcTokensForAmount(_poolAmount);

        uint256 totalBaseAmount = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            if (isPool[tokens[i]]) {
                totalBaseAmount += calcToChakra(tokens[i], _curreny, amounts[i]);
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

    function fromChakra(
        address _chakra,
        address _quoteToken,
        uint256 _poolAmount,
        uint256 _minQuoteToken
    ) external revertIfPaused {
        uint256 totalAmount = calcToChakra(_chakra, _quoteToken, _poolAmount);

        require(_minQuoteToken <= totalAmount, "Output currency amount too low");

        IPSmartPool chakra = IPSmartPool(_chakra);

        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra)
            .calcTokensForAmount(_poolAmount);
        chakra.transferFrom(msg.sender, address(this), _poolAmount);
        chakra.exitPool(_poolAmount);

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
                address(UNISWAP_FACTORY),
                tokens[i],
                _quoteToken
            );
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

    // Why is this here ??? same as calcToChakra right ?
    function calcToEth(address _chakra, uint256 _poolAmountOut) external view returns (uint256) {
        (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_chakra)
            .calcTokensForAmount(_poolAmountOut);

        uint256 totalEth = 0;

        for (uint256 i = 0; i < tokens.length; i++) {
            (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
                address(UNISWAP_FACTORY),
                tokens[i],
                address(WETH)
            );
            totalEth += UniLib.getAmountOut(amounts[i], reserveA, reserveB);
        }

        return totalEth;
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

    function getPools() external view returns (address[] memory) {
        return pools;
    }
}
