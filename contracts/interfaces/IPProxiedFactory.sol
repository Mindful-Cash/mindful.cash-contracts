pragma solidity ^0.6.4;

interface IPProxiedFactory {
    function newProxiedSmartPool(
        string calldata _name,
        string calldata _symbol,
        uint256 _initialSupply,
        address[] calldata _tokens,
        uint256[] calldata _amounts,
        uint256[] calldata _weights,
        uint256 _cap
    ) external returns (address);
}
