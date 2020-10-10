pragma solidity ^0.6.4;

import "@pie-dao/proxy/contracts/PProxyPausable.sol";

import "../interfaces/IBFactory.sol";
import "../interfaces/IBPool.sol";
import "../interfaces/IERC20.sol";
import "../Ownable.sol";
import "../interfaces/IPV2SmartPool.sol";
import "../libraries/LibSafeApprove.sol";

contract MindfulProxy is Ownable {
  using LibSafeApprove for IERC20;

  IBFactory public balancerFactory;

  address public smartPoolImplementation;

  mapping(address => address) public poolManager;
  mapping(address => bool) public isPool;

  address[] public pools;

  event SmartPoolCreated(address indexed poolAddress, address indexed poolManager, string name, string symbol);

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
  ) external returns (address) {
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
}
