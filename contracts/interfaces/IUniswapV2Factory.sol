pragma solidity ^0.6.4;

interface IUniswapV2Factory {
  function getPair(address tokenA, address tokenB) external view returns (address pair);
}
// File: localhost/contracts/interfaces/IPSmartPool.sol
