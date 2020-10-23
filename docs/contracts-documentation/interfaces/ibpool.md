# `IBPool`

## Functions:

- `isBound(address token) (external)`

- `getBalance(address token) (external)`

- `rebind(address token, uint256 balance, uint256 denorm) (external)`

- `setSwapFee(uint256 swapFee) (external)`

- `setPublicSwap(bool _public) (external)`

- `bind(address token, uint256 balance, uint256 denorm) (external)`

- `unbind(address token) (external)`

- `getDenormalizedWeight(address token) (external)`

- `getTotalDenormalizedWeight() (external)`

- `getCurrentTokens() (external)`

- `setController(address manager) (external)`

- `isPublicSwap() (external)`

- `getSwapFee() (external)`

- `gulp(address token) (external)`

- `calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee) (external)`

- `calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee) (external)`

- `calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee) (external)`

- `calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee) (external)`

### Function `isBound(address token) → bool external`

### Function `getBalance(address token) → uint256 external`

### Function `rebind(address token, uint256 balance, uint256 denorm) external`

### Function `setSwapFee(uint256 swapFee) external`

### Function `setPublicSwap(bool _public) external`

### Function `bind(address token, uint256 balance, uint256 denorm) external`

### Function `unbind(address token) external`

### Function `getDenormalizedWeight(address token) → uint256 external`

### Function `getTotalDenormalizedWeight() → uint256 external`

### Function `getCurrentTokens() → address[] external`

### Function `setController(address manager) external`

### Function `isPublicSwap() → bool external`

### Function `getSwapFee() → uint256 external`

### Function `gulp(address token) external`

### Function `calcPoolOutGivenSingleIn(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountIn, uint256 swapFee) → uint256 poolAmountOut external`

### Function `calcSingleInGivenPoolOut(uint256 tokenBalanceIn, uint256 tokenWeightIn, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountOut, uint256 swapFee) → uint256 tokenAmountIn external`

### Function `calcSingleOutGivenPoolIn(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 poolAmountIn, uint256 swapFee) → uint256 tokenAmountOut external`

### Function `calcPoolInGivenSingleOut(uint256 tokenBalanceOut, uint256 tokenWeightOut, uint256 poolSupply, uint256 totalWeight, uint256 tokenAmountOut, uint256 swapFee) → uint256 poolAmountIn external`
