# `LibPoolEntryExit`

## Modifiers:

- `lockBPoolSwap()`

## Functions:

- `exitPool(uint256 _amount) (internal)`

- `exitPool(uint256 _amount, uint256[] _minAmountsOut) (external)`

- `_exitPool(uint256 _amount, uint256[] _minAmountsOut) (internal)`

- `exitswapPoolAmountIn(address _token, uint256 _poolAmountIn, uint256 _minAmountOut) (external)`

- `exitswapExternAmountOut(address _token, uint256 _tokenAmountOut, uint256 _maxPoolAmountIn) (external)`

- `exitPoolTakingloss(uint256 _amount, address[] _lossTokens) (external)`

- `_contains(address _needle, address[] _haystack) (internal)`

- `joinPool(uint256 _amount) (external)`

- `joinPool(uint256 _amount, uint256[] _maxAmountsIn) (external)`

- `_joinPool(uint256 _amount, uint256[] _maxAmountsIn) (internal)`

- `joinswapExternAmountIn(address _token, uint256 _amountIn, uint256 _minPoolAmountOut) (external)`

- `joinswapPoolAmountOut(address _token, uint256 _amountOut, uint256 _maxAmountIn) (external)`

## Events:

- `LOG_EXIT(address caller, address tokenOut, uint256 tokenAmountOut)`

- `LOG_JOIN(address caller, address tokenIn, uint256 tokenAmountIn)`

- `PoolExited(address from, uint256 amount)`

- `PoolExitedWithLoss(address from, uint256 amount, address[] lossTokens)`

- `PoolJoined(address from, uint256 amount)`

### Modifier `lockBPoolSwap()`

### Function `exitPool(uint256 _amount) internal`

### Function `exitPool(uint256 _amount, uint256[] _minAmountsOut) external`

### Function `_exitPool(uint256 _amount, uint256[] _minAmountsOut) internal`

### Function `exitswapPoolAmountIn(address _token, uint256 _poolAmountIn, uint256 _minAmountOut) → uint256 tokenAmountOut external`

### Function `exitswapExternAmountOut(address _token, uint256 _tokenAmountOut, uint256 _maxPoolAmountIn) → uint256 poolAmountIn external`

### Function `exitPoolTakingloss(uint256 _amount, address[] _lossTokens) external`

### Function `_contains(address _needle, address[] _haystack) → bool internal`

Searches for an address in an array of addresses and returns if found

#### Parameters:

- `_needle`: Address to look for

- `_haystack`: Array to search

#### Return Values:

- If value is found

### Function `joinPool(uint256 _amount) external`

### Function `joinPool(uint256 _amount, uint256[] _maxAmountsIn) external`

### Function `_joinPool(uint256 _amount, uint256[] _maxAmountsIn) internal`

### Function `joinswapExternAmountIn(address _token, uint256 _amountIn, uint256 _minPoolAmountOut) → uint256 poolAmountOut external`

### Function `joinswapPoolAmountOut(address _token, uint256 _amountOut, uint256 _maxAmountIn) → uint256 tokenAmountIn external`

### Event `LOG_EXIT(address caller, address tokenOut, uint256 tokenAmountOut)`

### Event `LOG_JOIN(address caller, address tokenIn, uint256 tokenAmountIn)`

### Event `PoolExited(address from, uint256 amount)`

### Event `PoolExitedWithLoss(address from, uint256 amount, address[] lossTokens)`

### Event `PoolJoined(address from, uint256 amount)`
