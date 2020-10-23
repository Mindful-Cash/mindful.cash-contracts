# `IUniswapV2Pair`

## Functions:

- `name() (external)`

- `symbol() (external)`

- `decimals() (external)`

- `totalSupply() (external)`

- `balanceOf(address owner) (external)`

- `allowance(address owner, address spender) (external)`

- `approve(address spender, uint256 value) (external)`

- `transfer(address to, uint256 value) (external)`

- `transferFrom(address from, address to, uint256 value) (external)`

- `DOMAIN_SEPARATOR() (external)`

- `PERMIT_TYPEHASH() (external)`

- `nonces(address owner) (external)`

- `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) (external)`

- `MINIMUM_LIQUIDITY() (external)`

- `factory() (external)`

- `token0() (external)`

- `token1() (external)`

- `getReserves() (external)`

- `price0CumulativeLast() (external)`

- `price1CumulativeLast() (external)`

- `kLast() (external)`

- `mint(address to) (external)`

- `burn(address to) (external)`

- `swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data) (external)`

- `skim(address to) (external)`

- `sync() (external)`

- `initialize(address, address) (external)`

## Events:

- `Approval(address owner, address spender, uint256 value)`

- `Transfer(address from, address to, uint256 value)`

- `Mint(address sender, uint256 amount0, uint256 amount1)`

- `Burn(address sender, uint256 amount0, uint256 amount1, address to)`

- `Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)`

- `Sync(uint112 reserve0, uint112 reserve1)`

### Function `name() → string external`

### Function `symbol() → string external`

### Function `decimals() → uint8 external`

### Function `totalSupply() → uint256 external`

### Function `balanceOf(address owner) → uint256 external`

### Function `allowance(address owner, address spender) → uint256 external`

### Function `approve(address spender, uint256 value) → bool external`

### Function `transfer(address to, uint256 value) → bool external`

### Function `transferFrom(address from, address to, uint256 value) → bool external`

### Function `DOMAIN_SEPARATOR() → bytes32 external`

### Function `PERMIT_TYPEHASH() → bytes32 external`

### Function `nonces(address owner) → uint256 external`

### Function `permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external`

### Function `MINIMUM_LIQUIDITY() → uint256 external`

### Function `factory() → address external`

### Function `token0() → address external`

### Function `token1() → address external`

### Function `getReserves() → uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast external`

### Function `price0CumulativeLast() → uint256 external`

### Function `price1CumulativeLast() → uint256 external`

### Function `kLast() → uint256 external`

### Function `mint(address to) → uint256 liquidity external`

### Function `burn(address to) → uint256 amount0, uint256 amount1 external`

### Function `swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data) external`

### Function `skim(address to) external`

### Function `sync() external`

### Function `initialize(address, address) external`

### Event `Approval(address owner, address spender, uint256 value)`

### Event `Transfer(address from, address to, uint256 value)`

### Event `Mint(address sender, uint256 amount0, uint256 amount1)`

### Event `Burn(address sender, uint256 amount0, uint256 amount1, address to)`

### Event `Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)`

### Event `Sync(uint112 reserve0, uint112 reserve1)`
