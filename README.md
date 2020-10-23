# Mindful

### Portfolio Alignment for Degens

With Mindful, you can adopt strategies to mindfully DCA into cryptoassets, rebalance your portfolio, and take profits automatically. Let your mindful self plan for your degen self's future.

![](./src/assets/chakra.png)

## Docs and Links

- [Medium Post](https://medium.com/mindfulcash/introducing-mindful-portfolio-alignment-for-degens-7ff1aafe4f58)
- [Mindful Relayer](https://github.com/Mindful-Cash/relayer)
- [Twitter](https://twitter.com/mindfulcash)
- [Slide dec](https://docs.google.com/presentation/d/1oi8igtqZWn-fPtbnoKm9h-eYL1GKsGIijxb8H1VYQws/edit#slide=id.p)
- [Mockups](https://www.figma.com/file/6N4PRLldUjUvxqTkhRob3q/Mindful---ETHOnline-2020?node-id=0%3A1)
- [Contract documentation](./docs/contracts-documentation/mindful/mindfulproxy.md)

## What is Mindful?

Mindful was built out of a need. As DeFi natives ourselves, we wanted to learn from our mistakes and calm our degenerate tendencies. So, for [ETHOnline](https://hack.ethglobal.co/showcase/mindful-rec1A1jTI5wQcLPsp), we decided to build something we'd actually use.

_Ever told yourself you'll take profits but waited far too long? Ever sold the bottom and then bought back higher? Ever FOMOed into an asset at the top after it went 10x?_ We have - so we're building Mindful to avoid these traps.

With this new platform, you can adopt strategies to mindfully DCA into assets, rebalance your portfolio, and take profits automatically. Set your own strategy, or follow a guru.

Mindful's intuitive UI guides users seamlessly through the Chakra creation and strategy-setting process. Built on Ethereum, it works with all major wallets and ERC20 assets. With Mindful, we hope to enable other crypto traders to invest mindfully, take the emotion out of trading, and actually realize profits instead of riding gains back down to the bottom.

Start aligning your chakras today.

## Team

- 🇬🇧 **Chris Fulford** - Front-end, Integrations
- 🇿🇦 **Chris Maree** - Smart Contracts, Front End
- 🇹🇳 **Haythem Sellami** - Smart Contracts, Relayer Infra
- 🇳🇿 **Liesl Eichholz** - Design, UX/UI,, Memetics
- 🇩🇪 **Matthias Bachmann** - Design/ UX/UI, Memetics

## Chakras

**Chakras** are asset management agnostic (currently Balancer only) **D**ecentralised **T**raded **F**unds. They share a common interface to make them easy to integrate in other products.

All Smart Pools are fully upgradeable to make it easy to add features and optimise gas usage at later stages.

## How it works

Every Mindful portfolio (or “Chakra”) is a controlled Balancer pool, run and operated via the MindfulProxy contract.

### Chakra Deployment

To deploy a new Chakra, the MindfulProxy wraps the Balancer factory to create a custom permissioned smart pool using the user's specified Chakra parameters (underlying tokens, weightings, and initial amounts). On initial pool creation, the MindfulProxy enables a single-asset deposit into the pool by trading deposited tokens for the specified underlying tokens on Uniswap. For example, a 50/50 YFI/UNI Chakra, using USDC as a deposit asset, would first trade the USDC for YFI and UNI in the correct ratios, and then deposit these funds into the Chakra within a single transaction.

### Chakra Stategies

Two key components of Mindful are the automated DCA (buy) and profit-taking (sell) strategies. When a Chakra is created, the owner sets a strategy that defines when a buy/sell action can occur against their controlled pool. This includes specifying the delay between buys, or the target pool value increase for sells. The MindfulProxy contract then enables any third-party relayer to execute the strategy on the user's behalf.

### Buy Strategies

For buy strategies (i.e. DCAs into a Chakra), the proxy transfers the pre-approved reserve currency (e.g. USDC) from the user's wallet to the proxy, then trades the asset for the underlying pool tokens (e.g. YFI & UNI), and finally performs a multi-asset deposit into the Chakra (Balancer pool).

### Sell Strategies

For sell strategies the proxy executes a multi-asset withdrawal from the pool (e.g. YFI & UNI) and trades these tokens for the specified profit-taking currency (e.g. USDC), which is then sent back to the user's wallet.

In both buy and sell strategy cases, all interactions with the Balancer pool use multi-asset deposits and withdrawals in order to prevent slippage. At any point in time, if they want to override their strategy, the Chakra owner can "Fomo In" or “Fomo Out" of their Chakra by executing a multi-asset deposit or withdrawal.

### Relayer Bot

A relayer bot is used to monitor all Chakras within the Mindful ecosystem. If a strategy can be executed, the bot calls the associated function on the MindfulProxy. The strategy’s parameters guarantee that this is only done at the exact thresholds defined by the Chakra owner. To compensate relayer bots for their work and gas usage, they are rewarded with 0.3% of the total deposit or withdrawal amount.

## Code attribution

Some code in this project was borrowed, forked and modified, as it is the case with building DeFi products. This section outlines the opensource code that was coppied.

#### Smart contracts

The Chakra system and smart contracts in this repo are heavily inspired by Pie-dao's smart pools. You can find it on Github [here](https://github.com/pie-dao/pie-smart-pools). The initial version of this repo was a direct copy of their code and much of their original logic is still in the contracts. Specifically, our smart contract contribution for this hackathon is the `MindfulProxy.sol` contract which is completely new and novel. The rest of the contracts within the contracts directory are forked from pie-dao.

#### Relayer bot

All written during hackathon.

#### Front end

All written during hackathon.

## Development

### Setup the dev **enviroment\*\*\*\***

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

![](./src/assets/loading-no-shadow.gif)
