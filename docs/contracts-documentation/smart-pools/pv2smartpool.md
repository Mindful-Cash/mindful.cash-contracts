# `PV2SmartPool`

## Modifiers:

- `ready()`

- `onlyController()`

- `onlyPublicSwapSetter()`

- `onlyTokenBinder()`

- `onlyPublicSwap()`

- `onlyCircuitBreaker()`

- `onlyJoinExitEnabled()`

- `withinCap()`

## Functions:

- `init(address _bPool, string _name, string _symbol, uint256 _initialSupply) (external)`

- `approveTokens() (public)`

- `exitPoolTakingloss(uint256 _amount, address[] _lossTokens) (external)`

- `exitPool(uint256 _amount) (external)`

- `exitPool(uint256 _amount, uint256[] _minAmountsOut) (external)`

- `exitswapPoolAmountIn(address _token, uint256 _poolAmountIn, uint256 _minAmountOut) (external)`

- `exitswapExternAmountOut(address _token, uint256 _tokenAmountOut, uint256 _maxPoolAmountIn) (external)`

- `joinPool(uint256 _amount) (external)`

- `joinPool(uint256 _amount, uint256[] _maxAmountsIn) (external)`

- `joinswapExternAmountIn(address _token, uint256 _amountIn, uint256 _minPoolAmountOut) (external)`

- `joinswapPoolAmountOut(address _token, uint256 _amountOut, uint256 _maxAmountIn) (external)`

- `bind(address _token, uint256 _balance, uint256 _denorm) (external)`

- `rebind(address _token, uint256 _balance, uint256 _denorm) (external)`

- `unbind(address _token) (external)`

- `setController(address _controller) (external)`

- `setPublicSwapSetter(address _newPublicSwapSetter) (external)`

- `setTokenBinder(address _newTokenBinder) (external)`

- `setPublicSwap(bool _public) (external)`

- `setSwapFee(uint256 _swapFee) (external)`

- `setCap(uint256 _cap) (external)`

- `setJoinExitEnabled(bool _newValue) (external)`

- `setCircuitBreaker(address _newCircuitBreaker) (external)`

- `setAnnualFee(uint256 _newFee) (external)`

- `chargeOutstandingAnnualFee() (external)`

- `setFeeRecipient(address _newRecipient) (external)`

- `tripCircuitBreaker() (external)`

- `updateWeight(address _token, uint256 _newWeight) (external)`

- `updateWeightsGradually(uint256[] _newWeights, uint256 _startBlock, uint256 _endBlock) (external)`

- `pokeWeights() (external)`

- `applyAddToken() (external)`

- `commitAddToken(address _token, uint256 _balance, uint256 _denormalizedWeight) (external)`

- `removeToken(address _token) (external)`

- `calcTokensForAmount(uint256 _amount) (external)`

- `calcPoolOutGivenSingleIn(address _token, uint256 _amount) (external)`

- `calcSingleInGivenPoolOut(address _token, uint256 _amount) (external)`

- `calcSingleOutGivenPoolIn(address _token, uint256 _amount) (external)`

- `calcPoolInGivenSingleOut(address _token, uint256 _amount) (external)`

- `getTokens() (external)`

- `getController() (external)`

- `getPublicSwapSetter() (external)`

- `getTokenBinder() (external)`

- `getCircuitBreaker() (external)`

- `isPublicSwap() (external)`

- `getCap() (external)`

- `getAnnualFee() (external)`

- `getFeeRecipient() (external)`

- `getDenormalizedWeight(address _token) (external)`

- `getDenormalizedWeights() (external)`

- `getBPool() (external)`

- `getSwapFee() (external)`

- `getNewWeights() (external)`

- `getStartWeights() (external)`

- `getStartBlock() (external)`

- `getEndBlock() (external)`

- `getNewToken() (external)`

- `getJoinExitEnabled() (external)`

- `finalizeSmartPool() (external)`

- `createPool(uint256 initialSupply) (external)`

## Events:

- `TokensApproved()`

- `ControllerChanged(address previousController, address newController)`

- `PublicSwapSetterChanged(address previousSetter, address newSetter)`

- `TokenBinderChanged(address previousTokenBinder, address newTokenBinder)`

- `PublicSwapSet(address setter, bool value)`

- `SwapFeeSet(address setter, uint256 newFee)`

- `CapChanged(address setter, uint256 oldCap, uint256 newCap)`

- `CircuitBreakerTripped()`

- `JoinExitEnabledChanged(address setter, bool oldValue, bool newValue)`

- `CircuitBreakerChanged(address _oldCircuitBreaker, address _newCircuitBreaker)`

### Modifier `ready()`

### Modifier `onlyController()`

### Modifier `onlyPublicSwapSetter()`

### Modifier `onlyTokenBinder()`

### Modifier `onlyPublicSwap()`

### Modifier `onlyCircuitBreaker()`

### Modifier `onlyJoinExitEnabled()`

### Modifier `withinCap()`

### Function `init(address _bPool, string _name, string _symbol, uint256 _initialSupply) external`

Initialises the contract

#### Parameters:

- `_bPool`: Address of the underlying balancer pool

- `_name`: Name for the smart pool token

- `_symbol`: Symbol for the smart pool token

- `_initialSupply`: Initial token supply to mint

### Function `approveTokens() public`

Sets approval to all tokens to the underlying balancer pool

It uses this function to save on gas in joinPool

### Function `exitPoolTakingloss(uint256 _amount, address[] _lossTokens) external`

Burns pool shares and sends back the underlying assets leaving some in the pool

#### Parameters:

- `_amount`: Amount of pool tokens to burn

- `_lossTokens`: Tokens skipped on redemption

### Function `exitPool(uint256 _amount) external`

Burns pool shares and sends back the underlying assets

#### Parameters:

- `_amount`: Amount of pool tokens to burn

### Function `exitPool(uint256 _amount, uint256[] _minAmountsOut) external`

Burn pool tokens and redeem underlying assets. With front running protection

#### Parameters:

- `_amount`: Amount of pool tokens to burn

- `_minAmountsOut`: Minimum amounts of underlying assets

### Function `exitswapPoolAmountIn(address _token, uint256 _poolAmountIn, uint256 _minAmountOut) → uint256 tokenAmountOut external`

Exitswap single asset pool exit given pool amount in

#### Parameters:

- `_token`: Address of exit token

- `_poolAmountIn`: Amount of pool tokens sending to the pool

#### Return Values:

- tokenAmountOut amount of exit tokens being withdrawn

### Function `exitswapExternAmountOut(address _token, uint256 _tokenAmountOut, uint256 _maxPoolAmountIn) → uint256 poolAmountIn external`

Exitswap single asset pool entry given token amount out

#### Parameters:

- `_token`: Address of exit token

- `_tokenAmountOut`: Amount of exit tokens

#### Return Values:

- poolAmountIn amount of pool tokens being deposited

### Function `joinPool(uint256 _amount) external`

Takes underlying assets and mints smart pool tokens. Enforces the cap

#### Parameters:

- `_amount`: Amount of pool tokens to mint

### Function `joinPool(uint256 _amount, uint256[] _maxAmountsIn) external`

Takes underlying assets and mints smart pool tokens.

Enforces the cap. Allows you to specify the maximum amounts of underlying assets

#### Parameters:

- `_amount`: Amount of pool tokens to mint

### Function `joinswapExternAmountIn(address _token, uint256 _amountIn, uint256 _minPoolAmountOut) → uint256 poolAmountOut external`

Joinswap single asset pool entry given token amount in

#### Parameters:

- `_token`: Address of entry token

- `_amountIn`: Amount of entry tokens

### Function `joinswapPoolAmountOut(address _token, uint256 _amountOut, uint256 _maxAmountIn) → uint256 tokenAmountIn external`

Joinswap single asset pool entry given pool amount out

#### Parameters:

- `_token`: Address of entry token

- `_amountOut`: Amount of entry tokens to deposit into the pool

### Function `bind(address _token, uint256 _balance, uint256 _denorm) external`

Bind a token to the underlying balancer pool. Can only be called by the token binder

#### Parameters:

- `_token`: Token to bind

- `_balance`: Amount to bind

- `_denorm`: Denormalised weight

### Function `rebind(address _token, uint256 _balance, uint256 _denorm) external`

Rebind a token to the pool

#### Parameters:

- `_token`: Token to bind

- `_balance`: Amount to bind

- `_denorm`: Denormalised weight

### Function `unbind(address _token) external`

Unbind a token

#### Parameters:

- `_token`: Token to unbind

### Function `setController(address _controller) external`

Sets the controller address. Can only be set by the current controller

#### Parameters:

- `_controller`: Address of the new controller

### Function `setPublicSwapSetter(address _newPublicSwapSetter) external`

Sets public swap setter address. Can only be set by the controller

#### Parameters:

- `_newPublicSwapSetter`: Address of the new public swap setter

### Function `setTokenBinder(address _newTokenBinder) external`

Sets the token binder address. Can only be set by the controller

#### Parameters:

- `_newTokenBinder`: Address of the new token binder

### Function `setPublicSwap(bool _public) external`

Enables or disables public swapping on the underlying balancer pool.

Can only be set by the controller.

#### Parameters:

- `_public`: Public or not

### Function `setSwapFee(uint256 _swapFee) external`

Set the swap fee on the underlying balancer pool.

Can only be called by the controller.

#### Parameters:

- `_swapFee`: The new swap fee

### Function `setCap(uint256 _cap) external`

Set the maximum cap of the contract

#### Parameters:

- `_cap`: New cap in wei

### Function `setJoinExitEnabled(bool _newValue) external`

Enable or disable joining and exiting

#### Parameters:

- `_newValue`: enabled or not

### Function `setCircuitBreaker(address _newCircuitBreaker) external`

Set the circuit breaker address. Can only be called by the controller

#### Parameters:

- `_newCircuitBreaker`: Address of the new circuit breaker

### Function `setAnnualFee(uint256 _newFee) external`

Set the annual fee. Can only be called by the controller

#### Parameters:

- `_newFee`: new fee 10**18 == 100% per 365 days. Max 10%

### Function `chargeOutstandingAnnualFee() external`

Charge the outstanding annual fee

### Function `setFeeRecipient(address _newRecipient) external`

Set the address that receives the annual fee. Can only be called by the controller

### Function `tripCircuitBreaker() external`

Trip the circuit breaker which disabled exit, join and swaps

### Function `updateWeight(address _token, uint256 _newWeight) external`

Update the weight of a token. Can only be called by the controller

#### Parameters:

- `_token`: Token to adjust the weight of

- `_newWeight`: New denormalized weight

### Function `updateWeightsGradually(uint256[] _newWeights, uint256 _startBlock, uint256 _endBlock) external`

Gradually adjust the weights of a token. Can only be called by the controller

#### Parameters:

- `_newWeights`: Target weights

- `_startBlock`: Block to start weight adjustment

- `_endBlock`: Block to finish weight adjustment

### Function `pokeWeights() external`

Poke the weight adjustment

### Function `applyAddToken() external`

Apply the adding of a token. Can only be called by the controller

### Function `commitAddToken(address _token, uint256 _balance, uint256 _denormalizedWeight) external`

Commit a token to be added. Can only be called by the controller

#### Parameters:

- `_token`: Address of the token to add

- `_balance`: Amount of token to add

- `_denormalizedWeight`: Denormalized weight

### Function `removeToken(address _token) external`

Remove a token from the smart pool. Can only be called by the controller

#### Parameters:

- `_token`: Address of the token to remove

### Function `calcTokensForAmount(uint256 _amount) → address[] tokens, uint256[] amounts external`

Gets the underlying assets and amounts to mint specific pool shares.

#### Parameters:

- `_amount`: Amount of pool shares to calculate the values for

#### Return Values:

- tokens The addresses of the tokens

- amounts The amounts of tokens needed to mint that amount of pool shares

### Function `calcPoolOutGivenSingleIn(address _token, uint256 _amount) → uint256 external`

Calculate the amount of pool tokens out for a given amount in

#### Parameters:

- `_token`: Address of the input token

- `_amount`: Amount of input token

#### Return Values:

- Amount of pool token

### Function `calcSingleInGivenPoolOut(address _token, uint256 _amount) → uint256 external`

Calculate single in given pool out

#### Parameters:

- `_token`: Address of the input token

- `_amount`: Amount of pool out token

#### Return Values:

- Amount of token in

### Function `calcSingleOutGivenPoolIn(address _token, uint256 _amount) → uint256 external`

Calculate single out given pool in

#### Parameters:

- `_token`: Address of output token

- `_amount`: Amount of pool in

#### Return Values:

- Amount of token in

### Function `calcPoolInGivenSingleOut(address _token, uint256 _amount) → uint256 external`

Calculate pool in given single token out

#### Parameters:

- `_token`: Address of output token

- `_amount`: Amount of output token

#### Return Values:

- Amount of pool in

### Function `getTokens() → address[] external`

Get the current tokens in the smart pool

#### Return Values:

- Addresses of the tokens in the smart pool

### Function `getController() → address external`

Get the address of the controller

#### Return Values:

- The address of the pool

### Function `getPublicSwapSetter() → address external`

Get the address of the public swap setter

#### Return Values:

- The public swap setter address

### Function `getTokenBinder() → address external`

Get the address of the token binder

#### Return Values:

- The token binder address

### Function `getCircuitBreaker() → address external`

Get the address of the circuitBreaker

#### Return Values:

- The address of the circuitBreaker

### Function `isPublicSwap() → bool external`

Get if public swapping is enabled

#### Return Values:

- If public swapping is enabled

### Function `getCap() → uint256 external`

Get the current cap

#### Return Values:

- The current cap in wei

### Function `getAnnualFee() → uint256 external`

### Function `getFeeRecipient() → address external`

### Function `getDenormalizedWeight(address _token) → uint256 external`

Get the denormalized weight of a specific token in the underlying balancer pool

#### Return Values:

- the normalized weight of the token in uint

### Function `getDenormalizedWeights() → uint256[] weights external`

Get all denormalized weights

#### Return Values:

- weights Denormalized weights

### Function `getBPool() → address external`

Get the address of the underlying Balancer pool

#### Return Values:

- The address of the underlying balancer pool

### Function `getSwapFee() → uint256 external`

Get the current swap fee

#### Return Values:

- The current swap fee

### Function `getNewWeights() → uint256[] weights external`

Get the target weights

#### Return Values:

- weights Target weights

### Function `getStartWeights() → uint256[] weights external`

Get weights at start of weight adjustment

#### Return Values:

- weights Start weights

### Function `getStartBlock() → uint256 external`

Get start block of weight adjustment

#### Return Values:

- Start block

### Function `getEndBlock() → uint256 external`

Get end block of weight adjustment

#### Return Values:

- End block

### Function `getNewToken() → struct PV2SmartPoolStorage.NewToken external`

Get new token being added

#### Return Values:

- New token

### Function `getJoinExitEnabled() → bool external`

Get if joining and exiting is enabled

#### Return Values:

- Enabled or not

### Function `finalizeSmartPool() external`

Not Supported in PieDAO implementation of Balancer Smart Pools

### Function `createPool(uint256 initialSupply) external`

Not Supported in PieDAO implementation of Balancer Smart Pools

### Event `TokensApproved()`

### Event `ControllerChanged(address previousController, address newController)`

### Event `PublicSwapSetterChanged(address previousSetter, address newSetter)`

### Event `TokenBinderChanged(address previousTokenBinder, address newTokenBinder)`

### Event `PublicSwapSet(address setter, bool value)`

### Event `SwapFeeSet(address setter, uint256 newFee)`

### Event `CapChanged(address setter, uint256 oldCap, uint256 newCap)`

### Event `CircuitBreakerTripped()`

### Event `JoinExitEnabledChanged(address setter, bool oldValue, bool newValue)`

### Event `CircuitBreakerChanged(address _oldCircuitBreaker, address _newCircuitBreaker)`
