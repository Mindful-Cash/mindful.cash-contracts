# `MindfulProxy`

## Modifiers:

- `revertIfPaused()`

- `onlyChakraManager(address _chakra, address _sender)`

## Functions:

- `init(address _balancerFactory, address _implementation) (public)`

- `togglePause() (public)`

- `newProxiedSmartPool(string _name, string _symbol, uint256 _initialSupply, address[] _tokens, uint256[] _amounts, uint256[] _weights, uint256 _cap) (public)`

- `calcToChakra(address _chakra, address _curreny, uint256 _poolAmount) (public)`

- `setImplementation(address _implementation) (external)`

- `addSellStrategy(address _chakra, string _name, address[] _sellTokens, uint256[] _prices) (external)`

- `addBuyStrategy(address _chakra, address _buyToken, string _name, uint256 _interBuyDelay, uint256 _buyAmount) (external)`

- `disableSellStrategy(address _chakra, uint256 _sellStrategyId) (external)`

- `disableBuyStrategy(address _chakra, uint256 _buyStrategyId) (external)`

- `enableSellStrategy(address _chakra, uint256 _sellStrategyId) (external)`

- `enableBuyStrategy(address _chakra, uint256 _buyStrategyId) (external)`

- `toChakra(address _chakra, address _baseToken, uint256 _poolAmount, uint256 _baseAmount, uint256 _buyStrategyId) (external)`

- `fromChakra(struct MindfulProxy.FromChakraArg _arg) (external)`

- `saveEth() (external)`

- `saveToken(address _token) (external)`

- `fromChakra(address _chakra, address _sellToken, uint256 _poolAmountOut) (external)`

- `getChakras() (external)`

- `getSellStrategies() (external)`

- `getBuyStrategies() (external)`

- `token0Or1(address tokenA, address tokenB) (internal)`

- `_toChakra(address _chakra, address _baseToken, uint256 _poolAmount) (internal)`

- `isRelayerBuying(address _chakra, address _baseToken, uint256 _buyStrategyId) (internal)`

- `isRelayerSelling(address _chakra, address _sellToken, uint256 _sellStrategyId, uint256 _tokenIndex) (internal)`

## Events:

- `SmartPoolCreated(address chakra, address chakraManager, string name, string symbol)`

- `BuyStrategyAdded(address chakra, string buyStrategyName, uint256 buyStrategyId)`

- `SellStrategyAdded(address chakra, string sellStrategyName, uint256 sellStrategyId)`

- `BuyStrategyDisabled(address chakra, uint256 buyStrategyId)`

- `SellStrategyDisabled(address chakra, uint256 sellStrategyId)`

- `BuyStrategyEnabled(address chakra, uint256 buyStrategyId)`

- `SellStrategyEnabled(address chakra, uint256 sellStrategyId)`

- `SellStrategyUpdated(address chakra, uint256 sellStrategyId)`

- `BuyStrategyUpdated(address chakra, uint256 sellStrategyId)`

### Modifier `revertIfPaused()`

### Modifier `onlyChakraManager(address _chakra, address _sender)`

### Function `init(address _balancerFactory, address _implementation) public`

### Function `togglePause() public`

### Function `newProxiedSmartPool(string _name, string _symbol, uint256 _initialSupply, address[] _tokens, uint256[] _amounts, uint256[] _weights, uint256 _cap) → address public`

### Function `calcToChakra(address _chakra, address _curreny, uint256 _poolAmount) → uint256 public`

### Function `setImplementation(address _implementation) external`

### Function `addSellStrategy(address _chakra, string _name, address[] _sellTokens, uint256[] _prices) external`

### Function `addBuyStrategy(address _chakra, address _buyToken, string _name, uint256 _interBuyDelay, uint256 _buyAmount) external`

### Function `disableSellStrategy(address _chakra, uint256 _sellStrategyId) external`

### Function `disableBuyStrategy(address _chakra, uint256 _buyStrategyId) external`

### Function `enableSellStrategy(address _chakra, uint256 _sellStrategyId) external`

### Function `enableBuyStrategy(address _chakra, uint256 _buyStrategyId) external`

### Function `toChakra(address _chakra, address _baseToken, uint256 _poolAmount, uint256 _baseAmount, uint256 _buyStrategyId) external`

### Function `fromChakra(struct MindfulProxy.FromChakraArg _arg) external`

### Function `saveEth() external`

### Function `saveToken(address _token) external`

### Function `fromChakra(address _chakra, address _sellToken, uint256 _poolAmountOut) → uint256 external`

### Function `getChakras() → address[] external`

### Function `getSellStrategies() → struct MindfulProxy.SellStrategy[] external`

### Function `getBuyStrategies() → struct MindfulProxy.BuyStrategy[] external`

### Function `token0Or1(address tokenA, address tokenB) → uint256 internal`

### Function `_toChakra(address _chakra, address _baseToken, uint256 _poolAmount) internal`

### Function `isRelayerBuying(address _chakra, address _baseToken, uint256 _buyStrategyId) → bool, address payable, address, uint256 internal`

### Function `isRelayerSelling(address _chakra, address _sellToken, uint256 _sellStrategyId, uint256 _tokenIndex) → bool, address payable, address, uint256 internal`

### Event `SmartPoolCreated(address chakra, address chakraManager, string name, string symbol)`

### Event `BuyStrategyAdded(address chakra, string buyStrategyName, uint256 buyStrategyId)`

### Event `SellStrategyAdded(address chakra, string sellStrategyName, uint256 sellStrategyId)`

### Event `BuyStrategyDisabled(address chakra, uint256 buyStrategyId)`

### Event `SellStrategyDisabled(address chakra, uint256 sellStrategyId)`

### Event `BuyStrategyEnabled(address chakra, uint256 buyStrategyId)`

### Event `SellStrategyEnabled(address chakra, uint256 sellStrategyId)`

### Event `SellStrategyUpdated(address chakra, uint256 sellStrategyId)`

### Event `BuyStrategyUpdated(address chakra, uint256 sellStrategyId)`
