# Mindful

### Portfolio Alignment for Degens

With Mindful, you can adopt strategies to mindfully DCA into cryptoassets, rebalance your portfolio, and take profits automatically. Let your mindful self plan for your degen self's future.

![](https://ethglobal.s3.amazonaws.com/rec1A1jTI5wQcLPsp/cover_image_mindful.png)

## What is Mindful?

Mindful was built out of a need. As DeFi natives ourselves, we wanted to learn from our mistakes and calm our degenerate tendencies. So, for [ETHOnline](https://hack.ethglobal.co/showcase/mindful-rec1A1jTI5wQcLPsp), we decided to build something we'd actually use.

_Ever told yourself you'll take profits but waited far too long? Ever sold the bottom and then bought back higher? Ever FOMOed into an asset at the top after it went 10x?_ We have - so we're building Mindful to avoid these traps.

With this new platform, you can adopt strategies to mindfully DCA into assets, rebalance your portfolio, and take profits automatically. Set your own strategy, or follow a guru.

Mindful's intuitive UI guides users seamlessly through the Chakra creation and strategy-setting process. Built on Ethereum, it works with all major wallets and ERC20 assets. With Mindful, we hope to enable other crypto traders to invest mindfully, take the emotion out of trading, and actually realize profits instead of riding gains back down to the bottom.

Start aligning your chakras today.

## Chakras

**Chakras** are asset management agnostic (currently Balancer only) **D**ecentralised **T**raded **F**unds. They share a common interface to make them easy to integrate in other products.

All Smart Pools are fully upgradeable to make it easy to add features and optimise gas usage at later stages.

## Development

## How it works

Each Chakra is a controlled balancer pool, run and operated by the MindfulProxy contract. To deploy new Chakras, this proxy wraps the Balancer factory to create a custom permission's smart pool using the users Chakra parameters (underlying tokens, weightings and initial amounts). On initial pool creation the MindfulProxy enables single asset deposit into the pool by trading for the required underlying tokens on Uniswap. For example a 50/50 YFI UNI Chakra, created using USDC, would first trade the USDC for YFI and UNI in the correct ratios and then deposit into the Chakra within one transaction.

A key component of Mindful.cash are the automated DCA buying and threshold selling strategies. The Chakra owner enables a strategy that defines when a buy/sell action can occur against their controlled pool. This includes specifying the delay between buys or the percentage pool value increase targets for sells. The MindfulProxy contract then enables any third party relayer to execute the strategy on the users behalf. For buy strategy (DCA into a Chakra) the proxy transfers pre-approved reserve currency(eg USDC) from the Chakra owners wallet to the proxy, trades for underlying pool tokens (eg YFI & UNI) and then preforms multi-asset deposit into the Chakra (balancer pool). For sell strategies the opposite is done: multi-asset withdraw from the pool(eg YFI & UNI), pool tokens traded for sell strategy reserve currency (eg USDC) which is then sent back to the sponsors wallet. In both buy and sell strategy cases multi asset deposit and withdrawal are done to prevent any slippage against the pools.

A relayer bot is used to monitor all Chakras within mindful.cash's ecosystem. If a strategy can be executed then it calls the associated function on the MindfulProxy. The strategy rules will enforce that this is only done at the exact thresholds the creator defined. To compensate the relayer for their hard work they paid 0.3% of the total amount spent in the strategy.

### Setup the dev **enviroment******

Clone this repo. And copy the contents of `env.example` to a new file called `.env` and edit the the relevant values inside. **DO NOT** share this file with anyone as it will contain sensitive data.

Install all dependencies:

```
yarn
```

Build the project:

```
yarn build
```

Run the tests:

```
yarn test
```

Create coverage report:

```
yarn coverage
```

### Running mainnet/testnet test

To test a new implementation in testnet conditions. Set the implementation of a test pool to the new version and run the following script.

```
POOL=[POOL_ADDRESS] npx buidler test ./mainnet-test/test.ts --network [rinkeby|kovan|rinkeby]
```

## Integration

### Adding and removing liquidity

To add liquidity approve the smart pool to pull the underlying tokens. And call:

```solidity
function joinPool(uint256 _amount) external;
```

To remove liquidity:

```solidity
function exitPool(uint256 _amount) external;
```

### Getting pool details

To get the underlying tokens call:

```solidity
function getTokens() external view returns (address[] memory);
```

To get the underlying tokens and amounts needed to mint a certain amount of pool shares call:

```solidity
function calcTokensForAmount(uint256 _amount) external view returns (address[] memory tokens, uint256[] memory amounts);
```

#### Balancer smart pool specific

Get the address of the underlying balancer pool:

```solidity
function getBPool() external view returns (address);
```

Get the swap fee:

```solidity
function getSwapFee() external view returns (uint256);
```

Get if trading is enabled on the underlying balancer pool:

```solidity
function isPublicSwap() external view returns (bool);
```

#### Capped pool specific

Some pools have a cap which limits the totalSupply of the pool shares token. To get the cap you call:

```solidity
function getCap() external view returns (uint256);
```
