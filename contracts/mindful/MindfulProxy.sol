pragma solidity ^0.6.4;

import "./UniLib.sol";

import "@pie-dao/proxy/contracts/PProxyPausable.sol";

import "../interfaces/IBFactory.sol";
import "../interfaces/IBPool.sol";
import "../interfaces/IERC20.sol";
import "../Ownable.sol";
import "../interfaces/IPV2SmartPool.sol";
import "../libraries/LibSafeApprove.sol";

contract MindfulProxy is Ownable {
  using SafeMath for uint256;
  using LibSafeApprove for IERC20;

  IBFactory public balancerFactory;

  address public smartPoolImplementation;

  mapping(address => address) public poolManager;
  mapping(address => bool) public isPool;

  address[] public pools;

  event SmartPoolCreated(
    address indexed poolAddress,
    address indexed poolManager,
    string name,
    string symbol
  );

  IWETH public constant WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
  IUniswapV2Factory constant uniswapFactory = IUniswapV2Factory(
    0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
  );
  ISmartPoolRegistry public constant registry = ISmartPoolRegistry(
    0x412a5d5eC35fF185D6BfF32a367a985e1FB7c296
  );
  bool private isPaused = false;

  function togglePause() public onlyOwner {
    isPaused = !isPaused;
  }

  constructor() public {
    _setOwner(msg.sender);
  }

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
  ) external revertIfPaused returns (address) {
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
  function toPie(address _pie, uint256 _poolAmount) external payable revertIfPausedsa {
    require(registry.inRegistry(_pie), "Not a Pie");
    uint256 totalEth = calcToPie(_pie, _poolAmount);
    require(msg.value >= totalEth, "Amount ETH too low");

    WETH.deposit{value: totalEth}();

    _toPie(_pie, _poolAmount);

    // return excess ETH
    if (address(this).balance != 0) {
      // Send any excess ETH back
      msg.sender.transfer(address(this).balance);
    }

    // Transfer pool tokens to msg.sender
    IERC20 pie = IERC20(_pie);

    IERC20(pie).transfer(msg.sender, pie.balanceOf(address(this)));
  }

  function _toPie(address _pie, uint256 _poolAmount) internal {
    (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_pie).calcTokensForAmount(
      _poolAmount
    );

    for (uint256 i = 0; i < tokens.length; i++) {
      if (registry.inRegistry(tokens[i])) {
        _toPie(tokens[i], amounts[i]);
      } else {
        IUniswapV2Exchange pair = IUniswapV2Exchange(
          UniLib.pairFor(address(uniswapFactory), tokens[i], address(WETH))
        );

        (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
          address(uniswapFactory),
          address(WETH),
          tokens[i]
        );
        uint256 amountIn = UniLib.getAmountIn(amounts[i], reserveA, reserveB);

        // UniswapV2 does not pull the token
        WETH.transfer(address(pair), amountIn);

        if (token0Or1(address(WETH), tokens[i]) == 0) {
          pair.swap(amounts[i], 0, address(this), new bytes(0));
        } else {
          pair.swap(0, amounts[i], address(this), new bytes(0));
        }
      }

      IERC20(tokens[i]).safeApprove(_pie, amounts[i]);
    }

    IPSmartPool pie = IPSmartPool(_pie);
    pie.joinPool(_poolAmount);
  }

  function calcToPie(address _pie, uint256 _poolAmount) public view returns (uint256) {
    (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_pie).calcTokensForAmount(
      _poolAmount
    );

    uint256 totalEth = 0;

    for (uint256 i = 0; i < tokens.length; i++) {
      if (registry.inRegistry(tokens[i])) {
        totalEth += calcToPie(tokens[i], amounts[i]);
      } else {
        (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
          address(uniswapFactory),
          address(WETH),
          tokens[i]
        );
        totalEth += UniLib.getAmountIn(amounts[i], reserveA, reserveB);
      }
    }

    return totalEth;
  }

  function toEth(
    address _pie,
    uint256 _poolAmount,
    uint256 _minEthAmount
  ) external revertIfPausedsa {
    uint256 totalEth = calcToPie(_pie, _poolAmount);
    require(_minEthAmount <= totalEth, "Output ETH amount too low");
    IPSmartPool pie = IPSmartPool(_pie);

    (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_pie).calcTokensForAmount(
      _poolAmount
    );
    pie.transferFrom(msg.sender, address(this), _poolAmount);
    pie.exitPool(_poolAmount);

    for (uint256 i = 0; i < tokens.length; i++) {
      (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
        address(uniswapFactory),
        tokens[i],
        address(WETH)
      );
      uint256 wethAmountOut = UniLib.getAmountOut(amounts[i], reserveA, reserveB);
      IUniswapV2Exchange pair = IUniswapV2Exchange(
        UniLib.pairFor(address(uniswapFactory), tokens[i], address(WETH))
      );

      // Uniswap V2 does not pull the token
      IERC20(tokens[i]).transfer(address(pair), amounts[i]);

      if (token0Or1(address(WETH), tokens[i]) == 0) {
        pair.swap(0, wethAmountOut, address(this), new bytes(0));
      } else {
        pair.swap(wethAmountOut, 0, address(this), new bytes(0));
      }
    }

    WETH.withdraw(totalEth);
    msg.sender.transfer(address(this).balance);
  }

  function calcToEth(address _pie, uint256 _poolAmountOut) external view returns (uint256) {
    (address[] memory tokens, uint256[] memory amounts) = IPSmartPool(_pie).calcTokensForAmount(
      _poolAmountOut
    );

    uint256 totalEth = 0;

    for (uint256 i = 0; i < tokens.length; i++) {
      (uint256 reserveA, uint256 reserveB) = UniLib.getReserves(
        address(uniswapFactory),
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

  function die() public onlyOwner {
    address payable _to = payable(los().owner);
    selfdestruct(_to);
  }

  function saveEth() external onlyOwner {
    msg.sender.transfer(address(this).balance);
  }

  function saveToken(address _token) external onlyOwner {
    IERC20 token = IERC20(_token);
    token.transfer(msg.sender, token.balanceOf(address(this)));
  }
}
