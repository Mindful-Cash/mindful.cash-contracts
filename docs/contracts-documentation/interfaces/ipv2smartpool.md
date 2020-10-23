# `IPV2SmartPool`

## Functions:

- `init(address _bPool, string _name, string _symbol, uint256 _initialSupply) (external)`

- `setPublicSwapSetter(address _swapSetter) (external)`

- `setTokenBinder(address _tokenBinder) (external)`

- `setPublicSwap(bool _public) (external)`

- `setSwapFee(uint256 _swapFee) (external)`

- `setCap(uint256 _cap) (external)`

- `setAnnualFee(uint256 _newFee) (external)`

- `chargeOutstandingAnnualFee() (external)`

- `setFeeRecipient(address _newRecipient) (external)`

- `setController(address _controller) (external)`

- `setCircuitBreaker(address _newCircuitBreaker) (external)`

- `setJoinExitEnabled(bool _newValue) (external)`

- `tripCircuitBreaker() (external)`

- `updateWeight(address _token, uint256 _newWeight) (external)`

- `updateWeightsGradually(uint256[] _newWeights, uint256 _startBlock, uint256 _endBlock) (external)`

- `pokeWeights() (external)`

- `applyAddToken() (external)`

- `commitAddToken(address _token, uint256 _balance, uint256 _denormalizedWeight) (external)`

- `removeToken(address _token) (external)`

- `approveTokens() (external)`

- `joinPool(uint256 _amount) (external)`

- `joinPool(uint256 _amount, uint256[] _maxAmountsIn) (external)`

- `exitPool(uint256 _amount) (external)`

- `exitPool(uint256 _amount, uint256[] _minAmountsOut) (external)`

- `joinswapExternAmountIn(address _token, uint256 _amountIn, uint256 _minPoolAmountOut) (external)`

- `joinswapPoolAmountOut(address _token, uint256 _amountOut, uint256 _maxAmountIn) (external)`

- `exitswapPoolAmountIn(address _token, uint256 _poolAmountIn, uint256 _minAmountOut) (external)`

- `exitswapExternAmountOut(address _token, uint256 _tokenAmountOut, uint256 _maxPoolAmountIn) (external)`

- `exitPoolTakingloss(uint256 _amount, address[] _lossTokens) (external)`

- `bind(address _token, uint256 _balance, uint256 _denorm) (external)`

- `rebind(address _token, uint256 _balance, uint256 _denorm) (external)`

- `unbind(address _token) (external)`

- `getController() (external)`

- `getPublicSwapSetter() (external)`

- `getTokenBinder() (external)`

- `getCircuitBreaker() (external)`

- `isPublicSwap() (external)`

- `getTokens() (external)`

- `getCap() (external)`

- `getAnnualFee() (external)`

- `getFeeRecipient() (external)`

- `getDenormalizedWeight(address _token) (external)`

- `getDenormalizedWeights() (external)`

- `getNewWeights() (external)`

- `getStartWeights() (external)`

- `getStartBlock() (external)`

- `getEndBlock() (external)`

- `getNewToken() (external)`

- `getJoinExitEnabled() (external)`

- `getBPool() (external)`

- `getSwapFee() (external)`

- `finalizeSmartPool() (external)`

- `createPool(uint256 initialSupply) (external)`

- `calcTokensForAmount(uint256 _amount) (external)`

- `calcPoolOutGivenSingleIn(address _token, uint256 _amount) (external)`

- `calcSingleInGivenPoolOut(address _token, uint256 _amount) (external)`

- `calcSingleOutGivenPoolIn(address _token, uint256 _amount) (external)`

- `calcPoolInGivenSingleOut(address _token, uint256 _amount) (external)`

### Function `init(address _bPool, string _name, string _symbol, uint256 _initialSupply) external`

Initialise smart pool. Can only be called once

#### Parameters:

- `_bPool`: Address of the underlying bPool

- `_name`: Token name

- `_symbol`: Token symbol (ticker)

- `_initialSupply`: Initial token supply

### Function `setPublicSwapSetter(address _swapSetter) external`

Set the address that can set public swap enabled or disabled. 

Can only be called by the controller

#### Parameters:

- `_swapSetter`: Address of the new swapSetter

### Function `setTokenBinder(address _tokenBinder) external`

Set the address that can bind, unbind and rebind tokens.

Can only be called by the controller

#### Parameters:

- `_tokenBinder`: Address of the new token binder

### Function `setPublicSwap(bool _public) external`

Enable or disable trading on the underlying balancer pool.

Can only be called by the public swap setter

#### Parameters:

- `_public`: Wether public swap is enabled or not

### Function `setSwapFee(uint256 _swapFee) external`

Set the swap fee. Can only be called by the controller

#### Parameters:

- `_swapFee`: The new swap fee. 10**18 == 100%. Max 10%

### Function `setCap(uint256 _cap) external`

Set the totalSuppy cap. Can only be called by the controller

#### Parameters:

- `_cap`: New cap

### Function `setAnnualFee(uint256 _newFee) external`

Set the annual fee. Can only be called by the controller

#### Parameters:

- `_newFee`: new fee 10**18 == 100% per 365 days. Max 10%

### Function `chargeOutstandingAnnualFee() external`

Charge the outstanding annual fee

### Function `setFeeRecipient(address _newRecipient) external`

Set the address that receives the annual fee. Can only be called by the controller

### Function `setController(address _controller) external`

Set the controller address. Can only be called by the current address

#### Parameters:

- `_controller`: Address of the new controller

### Function `setCircuitBreaker(address _newCircuitBreaker) external`

Set the circuit breaker address. Can only be called by the controller

#### Parameters:

- `_newCircuitBreaker`: Address of the new circuit breaker

### Function `setJoinExitEnabled(bool _newValue) external`

Enable or disable joining and exiting

#### Parameters:

- `_newValue`: enabled or not

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

### Function `approveTokens() external`

Approve bPool to pull tokens from smart pool

### Function `joinPool(uint256 _amount) external`

Mint pool tokens, locking underlying assets

#### Parameters:

- `_amount`: Amount of pool tokens

### Function `joinPool(uint256 _amount, uint256[] _maxAmountsIn) external`

Mint pool tokens, locking underlying assets. With front running protection

#### Parameters:

- `_amount`: Amount of pool tokens

- `_maxAmountsIn`: Maximum amounts of underlying assets

### Function `exitPool(uint256 _amount) external`

Burn pool tokens and redeem underlying assets

#### Parameters:

- `_amount`: Amount of pool tokens to burn

### Function `exitPool(uint256 _amount, uint256[] _minAmountsOut) external`

Burn pool tokens and redeem underlying assets. With front running protection

#### Parameters:

- `_amount`: Amount of pool tokens to burn

- `_minAmountsOut`: Minimum amounts of underlying assets

### Function `joinswapExternAmountIn(address _token, uint256 _amountIn, uint256 _minPoolAmountOut) → uint256 external`

Join with a single asset, given amount of token in

#### Parameters:

- `_token`: Address of the underlying token to deposit

- `_amountIn`: Amount of underlying asset to deposit

- `_minPoolAmountOut`: Minimum amount of pool tokens to receive

### Function `joinswapPoolAmountOut(address _token, uint256 _amountOut, uint256 _maxAmountIn) → uint256 tokenAmountIn external`

Join with a single asset, given amount pool out

#### Parameters:

- `_token`: Address of the underlying token to deposit

- `_amountOut`: Amount of pool token to mint

- `_maxAmountIn`: Maximum amount of underlying asset

### Function `exitswapPoolAmountIn(address _token, uint256 _poolAmountIn, uint256 _minAmountOut) → uint256 tokenAmountOut external`

Exit with a single asset, given pool amount in

#### Parameters:

- `_token`: Address of the underlying token to withdraw

- `_poolAmountIn`: Amount of pool token to burn

- `_minAmountOut`: Minimum amount of underlying asset to withdraw

### Function `exitswapExternAmountOut(address _token, uint256 _tokenAmountOut, uint256 _maxPoolAmountIn) → uint256 poolAmountIn external`

Exit with a single asset, given token amount out

#### Parameters:

- `_token`: Address of the underlying token to withdraw

- `_tokenAmountOut`: Amount of underlying asset to withdraw

- `_maxPoolAmountIn`: Maximimum pool amount to burn

### Function `exitPoolTakingloss(uint256 _amount, address[] _lossTokens) external`

Exit pool, ignoring some tokens

#### Parameters:

- `_amount`: Amount of pool tokens to burn

- `_lossTokens`: Addresses of tokens to ignore

### Function `bind(address _token, uint256 _balance, uint256 _denorm) external`

Bind(add) a token to the pool

#### Parameters:

- `_token`: Address of the token to bind

- `_balance`: Amount of token to bind

- `_denorm`: Denormalised weight

### Function `rebind(address _token, uint256 _balance, uint256 _denorm) external`

Rebind(adjust) a token's weight or amount

#### Parameters:

- `_token`: Address of the token to rebind

- `_balance`: New token amount

- `_denorm`: New denormalised weight

### Function `unbind(address _token) external`

Unbind(remove) a token from the smart pool

#### Parameters:

- `_token`: Address of the token to unbind

### Function `getController() → address external`

Get the controller address

#### Return Values:

- Address of the controller

### Function `getPublicSwapSetter() → address external`

Get the public swap setter address

#### Return Values:

- Address of the public swap setter

### Function `getTokenBinder() → address external`

Get the address of the token binder

#### Return Values:

- Token binder address

### Function `getCircuitBreaker() → address external`

Get the circuit breaker address

#### Return Values:

- Circuit breaker address

### Function `isPublicSwap() → bool external`

Get if public trading is enabled or not

#### Return Values:

- Enabled or not

### Function `getTokens() → address[] external`

Get the current tokens in the smart pool

#### Return Values:

- Addresses of the tokens in the smart pool

### Function `getCap() → uint256 external`

Get the totalSupply cap

#### Return Values:

- The totalSupply cap

### Function `getAnnualFee() → uint256 external`

Get the annual fee

#### Return Values:

- the annual fee

### Function `getFeeRecipient() → address external`

Get the address receiving the fees

#### Return Values:

- Fee recipient address

### Function `getDenormalizedWeight(address _token) → uint256 external`

Get the denormalized weight of a token

#### Parameters:

- `_token`: Address of the token

#### Return Values:

- The denormalised weight of the token

### Function `getDenormalizedWeights() → uint256[] weights external`

Get all denormalized weights

#### Return Values:

- weights Denormalized weights

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

### Function `getBPool() → address external`

Get the underlying Balancer pool address

#### Return Values:

- Address of the underlying Balancer pool

### Function `getSwapFee() → uint256 external`

Get the swap fee

#### Return Values:

- Swap fee

### Function `finalizeSmartPool() external`

Not supported

### Function `createPool(uint256 initialSupply) external`

Not supported

### Function `calcTokensForAmount(uint256 _amount) → address[] tokens, uint256[] amounts external`

Calculate the amount of underlying needed to mint a certain amount

#### Return Values:

- tokens Addresses of the underlying tokens

- amounts Amounts of the underlying tokens

### Function `calcPoolOutGivenSingleIn(address _token, uint256 _amount) → uint256 external`

Calculate the amount of pool tokens out given underlying in

#### Parameters:

- `_token`: Underlying asset to deposit

- `_amount`: Amount of underlying asset to deposit

#### Return Values:

- Pool amount out

### Function `calcSingleInGivenPoolOut(address _token, uint256 _amount) → uint256 external`

Calculate underlying deposit amount given pool amount out

#### Parameters:

- `_token`: Underlying token to deposit

- `_amount`: Amount of pool out

#### Return Values:

- Underlying asset deposit amount

### Function `calcSingleOutGivenPoolIn(address _token, uint256 _amount) → uint256 external`

Calculate underlying amount out given pool amount in

#### Parameters:

- `_token`: Address of the underlying token to withdraw

- `_amount`: Pool amount to burn

#### Return Values:

- Amount of underlying to withdraw

### Function `calcPoolInGivenSingleOut(address _token, uint256 _amount) → uint256 external`

Calculate pool amount in given underlying input

#### Parameters:

- `_token`: Address of the underlying token to withdraw

- `_amount`: Underlying output amount

#### Return Values:

- Pool burn amount
