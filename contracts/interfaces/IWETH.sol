pragma solidity ^0.6.4;
pragma solidity ^0.6.4;

import "../interfaces/IERC20.sol";

interface IWETH is IERC20 {
  function deposit() external payable;

  function withdraw(uint256 wad) external;
}
