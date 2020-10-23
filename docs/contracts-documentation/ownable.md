# `Ownable`

## Modifiers:

- `onlyOwner()`

## Functions:

- `transferOwnership(address _newOwner) (external)`

- `_setOwner(address _newOwner) (internal)`

## Events:

- `OwnerChanged(address previousOwner, address newOwner)`

### Modifier `onlyOwner()`

### Function `transferOwnership(address _newOwner) external`

Transfer ownership to a new address

#### Parameters:

- `_newOwner`: Address of the new owner

### Function `_setOwner(address _newOwner) internal`

Internal method to set the owner

#### Parameters:

- `_newOwner`: Address of the new owner

### Event `OwnerChanged(address previousOwner, address newOwner)`
