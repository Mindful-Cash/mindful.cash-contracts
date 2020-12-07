/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import {Contract, ContractTransaction, EventFilter, Signer} from "ethers";
import {Listener, Provider} from "ethers/providers";
import {Arrayish, BigNumber, BigNumberish, Interface} from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface MindfulProxyInterface extends Interface {
  functions: {
    addBuyStrategy: TypedFunctionDescription<{
      encode([_chakra, _buyToken, _name, _interBuyDelay, _buyAmount]: [
        string,
        string,
        string,
        BigNumberish,
        BigNumberish
      ]): string;
    }>;

    addSellStrategy: TypedFunctionDescription<{
      encode([_chakra, _name, _sellTokens, _prices]: [
        string,
        string,
        string[],
        BigNumberish[]
      ]): string;
    }>;

    balancerFactory: TypedFunctionDescription<{encode([]: []): string}>;

    buyStrategies: TypedFunctionDescription<{
      encode([]: [BigNumberish]): string;
    }>;

    buyStrategyChakra: TypedFunctionDescription<{
      encode([]: [BigNumberish]): string;
    }>;

    calcToChakra: TypedFunctionDescription<{
      encode([_chakra, _currency, _poolAmount]: [
        string,
        string,
        BigNumberish
      ]): string;
    }>;

    chakraManager: TypedFunctionDescription<{encode([]: [string]): string}>;

    chakras: TypedFunctionDescription<{encode([]: [BigNumberish]): string}>;

    fromChakra: TypedFunctionDescription<{
      encode([_chakra, _sellToken, _poolAmountOut]: [
        string,
        string,
        BigNumberish
      ]): string;
    }>;

    getBuyStrategies: TypedFunctionDescription<{encode([]: []): string}>;

    getChakras: TypedFunctionDescription<{encode([]: []): string}>;

    getSellStrategies: TypedFunctionDescription<{encode([]: []): string}>;

    init: TypedFunctionDescription<{
      encode([_balancerFactory, _implementation]: [string, string]): string;
    }>;

    isChakra: TypedFunctionDescription<{encode([]: [string]): string}>;

    isPaused: TypedFunctionDescription<{encode([]: []): string}>;

    newProxiedSmartPool: TypedFunctionDescription<{
      encode([
        _name,
        _symbol,
        _initialSupply,
        _tokens,
        _amounts,
        _weights,
        _cap
      ]: [
        string,
        string,
        BigNumberish,
        string[],
        BigNumberish[],
        BigNumberish[],
        BigNumberish
      ]): string;
    }>;

    saveEth: TypedFunctionDescription<{encode([]: []): string}>;

    saveToken: TypedFunctionDescription<{encode([_token]: [string]): string}>;

    sellStrategies: TypedFunctionDescription<{
      encode([]: [BigNumberish]): string;
    }>;

    sellStrategyChakra: TypedFunctionDescription<{
      encode([]: [BigNumberish]): string;
    }>;

    setImplementation: TypedFunctionDescription<{
      encode([_implementation]: [string]): string;
    }>;

    smartPoolImplementation: TypedFunctionDescription<{encode([]: []): string}>;

    toChakra: TypedFunctionDescription<{
      encode([_arg]: [
        {
          chakra: string;
          baseToken: string;
          buyStrategyId: BigNumberish;
          poolAmount: BigNumberish;
          baseAmount: BigNumberish;
        }
      ]): string;
    }>;

    togglePause: TypedFunctionDescription<{encode([]: []): string}>;

    transferOwnership: TypedFunctionDescription<{
      encode([_newOwner]: [string]): string;
    }>;

    updateBuystrategy: TypedFunctionDescription<{
      encode([
        _chakra,
        _buyToken,
        _buyStrategyId,
        _interBuyDelay,
        _buyAmount,
        _isActive
      ]: [
        string,
        string,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        boolean
      ]): string;
    }>;
  };

  events: {
    BuyStrategyAdded: TypedEventDescription<{
      encodeTopics([chakra, buyStrategyName, buyStrategyId]: [
        string | null,
        null,
        BigNumberish | null
      ]): string[];
    }>;

    BuyStrategyDisabled: TypedEventDescription<{
      encodeTopics([chakra, buyStrategyId]: [
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    BuyStrategyEnabled: TypedEventDescription<{
      encodeTopics([chakra, buyStrategyId]: [
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    BuyStrategyUpdated: TypedEventDescription<{
      encodeTopics([chakra, sellStrategyId]: [
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    OwnerChanged: TypedEventDescription<{
      encodeTopics([previousOwner, newOwner]: [
        string | null,
        string | null
      ]): string[];
    }>;

    SellStrategyAdded: TypedEventDescription<{
      encodeTopics([chakra, sellStrategyName, sellStrategyId]: [
        string | null,
        null,
        BigNumberish | null
      ]): string[];
    }>;

    SellStrategyDisabled: TypedEventDescription<{
      encodeTopics([chakra, sellStrategyId]: [
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    SellStrategyEnabled: TypedEventDescription<{
      encodeTopics([chakra, sellStrategyId]: [
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    SellStrategyUpdated: TypedEventDescription<{
      encodeTopics([chakra, sellStrategyId]: [
        string | null,
        BigNumberish | null
      ]): string[];
    }>;

    SmartPoolCreated: TypedEventDescription<{
      encodeTopics([chakra, chakraManager, name, symbol]: [
        string | null,
        string | null,
        null,
        null
      ]): string[];
    }>;
  };
}

export class MindfulProxy extends Contract {
  connect(signerOrProvider: Signer | Provider | string): MindfulProxy;
  attach(addressOrName: string): MindfulProxy;
  deployed(): Promise<MindfulProxy>;

  on(event: EventFilter | string, listener: Listener): MindfulProxy;
  once(event: EventFilter | string, listener: Listener): MindfulProxy;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): MindfulProxy;
  removeAllListeners(eventName: EventFilter | string): MindfulProxy;
  removeListener(eventName: any, listener: Listener): MindfulProxy;

  interface: MindfulProxyInterface;

  functions: {
    addBuyStrategy(
      _chakra: string,
      _buyToken: string,
      _name: string,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "addBuyStrategy(address,address,string,uint256,uint256)"(
      _chakra: string,
      _buyToken: string,
      _name: string,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    addSellStrategy(
      _chakra: string,
      _name: string,
      _sellTokens: string[],
      _prices: BigNumberish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "addSellStrategy(address,string,address[],uint256[])"(
      _chakra: string,
      _name: string,
      _sellTokens: string[],
      _prices: BigNumberish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    balancerFactory(overrides?: TransactionOverrides): Promise<string>;

    "balancerFactory()"(overrides?: TransactionOverrides): Promise<string>;

    buyStrategies(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<{
      name: string;
      id: BigNumber;
      interBuyDelay: BigNumber;
      buyAmount: BigNumber;
      lastBuyTimestamp: BigNumber;
      buyToken: string;
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: string;
      6: boolean;
    }>;

    "buyStrategies(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<{
      name: string;
      id: BigNumber;
      interBuyDelay: BigNumber;
      buyAmount: BigNumber;
      lastBuyTimestamp: BigNumber;
      buyToken: string;
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: string;
      6: boolean;
    }>;

    buyStrategyChakra(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "buyStrategyChakra(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    calcToChakra(
      _chakra: string,
      _currency: string,
      _poolAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "calcToChakra(address,address,uint256)"(
      _chakra: string,
      _currency: string,
      _poolAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    chakraManager(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "chakraManager(address)"(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<string>;

    chakras(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "chakras(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    fromChakra(
      _chakra: string,
      _sellToken: string,
      _poolAmountOut: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "fromChakra(address,address,uint256)"(
      _chakra: string,
      _sellToken: string,
      _poolAmountOut: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "fromChakra(tuple)"(
      _arg: {
        _chakra: string;
        _sellToken: string;
        _sellStrategyId: BigNumberish;
        _sellTokenIndex: BigNumberish;
        _poolAmount: BigNumberish;
        _minQuoteToken: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getBuyStrategies(
      overrides?: TransactionOverrides
    ): Promise<
      {
        name: string;
        id: BigNumber;
        interBuyDelay: BigNumber;
        buyAmount: BigNumber;
        lastBuyTimestamp: BigNumber;
        buyToken: string;
        isActive: boolean;
        0: string;
        1: BigNumber;
        2: BigNumber;
        3: BigNumber;
        4: BigNumber;
        5: string;
        6: boolean;
      }[]
    >;

    "getBuyStrategies()"(
      overrides?: TransactionOverrides
    ): Promise<
      {
        name: string;
        id: BigNumber;
        interBuyDelay: BigNumber;
        buyAmount: BigNumber;
        lastBuyTimestamp: BigNumber;
        buyToken: string;
        isActive: boolean;
        0: string;
        1: BigNumber;
        2: BigNumber;
        3: BigNumber;
        4: BigNumber;
        5: string;
        6: boolean;
      }[]
    >;

    getChakras(overrides?: TransactionOverrides): Promise<string[]>;

    "getChakras()"(overrides?: TransactionOverrides): Promise<string[]>;

    getSellStrategies(
      overrides?: TransactionOverrides
    ): Promise<
      {
        name: string;
        id: BigNumber;
        prices: BigNumber[];
        sellTokens: string[];
        isExecuted: boolean[];
        isActive: boolean;
        0: string;
        1: BigNumber;
        2: BigNumber[];
        3: string[];
        4: boolean[];
        5: boolean;
      }[]
    >;

    "getSellStrategies()"(
      overrides?: TransactionOverrides
    ): Promise<
      {
        name: string;
        id: BigNumber;
        prices: BigNumber[];
        sellTokens: string[];
        isExecuted: boolean[];
        isActive: boolean;
        0: string;
        1: BigNumber;
        2: BigNumber[];
        3: string[];
        4: boolean[];
        5: boolean;
      }[]
    >;

    init(
      _balancerFactory: string,
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "init(address,address)"(
      _balancerFactory: string,
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    isChakra(arg0: string, overrides?: TransactionOverrides): Promise<boolean>;

    "isChakra(address)"(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<boolean>;

    isPaused(overrides?: TransactionOverrides): Promise<boolean>;

    "isPaused()"(overrides?: TransactionOverrides): Promise<boolean>;

    newProxiedSmartPool(
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "newProxiedSmartPool(string,string,uint256,address[],uint256[],uint256[],uint256)"(
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    saveEth(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    "saveEth()"(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    saveToken(
      _token: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "saveToken(address)"(
      _token: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    sellStrategies(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<{
      name: string;
      id: BigNumber;
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: boolean;
    }>;

    "sellStrategies(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<{
      name: string;
      id: BigNumber;
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: boolean;
    }>;

    sellStrategyChakra(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    "sellStrategyChakra(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<string>;

    setImplementation(
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "setImplementation(address)"(
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    smartPoolImplementation(overrides?: TransactionOverrides): Promise<string>;

    "smartPoolImplementation()"(
      overrides?: TransactionOverrides
    ): Promise<string>;

    toChakra(
      _arg: {
        chakra: string;
        baseToken: string;
        buyStrategyId: BigNumberish;
        poolAmount: BigNumberish;
        baseAmount: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "toChakra(tuple)"(
      _arg: {
        chakra: string;
        baseToken: string;
        buyStrategyId: BigNumberish;
        poolAmount: BigNumberish;
        baseAmount: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    togglePause(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    "togglePause()"(
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    transferOwnership(
      _newOwner: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      _newOwner: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    updateBuystrategy(
      _chakra: string,
      _buyToken: string,
      _buyStrategyId: BigNumberish,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      _isActive: boolean,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "updateBuystrategy(address,address,uint256,uint256,uint256,bool)"(
      _chakra: string,
      _buyToken: string,
      _buyStrategyId: BigNumberish,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      _isActive: boolean,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  addBuyStrategy(
    _chakra: string,
    _buyToken: string,
    _name: string,
    _interBuyDelay: BigNumberish,
    _buyAmount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "addBuyStrategy(address,address,string,uint256,uint256)"(
    _chakra: string,
    _buyToken: string,
    _name: string,
    _interBuyDelay: BigNumberish,
    _buyAmount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  addSellStrategy(
    _chakra: string,
    _name: string,
    _sellTokens: string[],
    _prices: BigNumberish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "addSellStrategy(address,string,address[],uint256[])"(
    _chakra: string,
    _name: string,
    _sellTokens: string[],
    _prices: BigNumberish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  balancerFactory(overrides?: TransactionOverrides): Promise<string>;

  "balancerFactory()"(overrides?: TransactionOverrides): Promise<string>;

  buyStrategies(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<{
    name: string;
    id: BigNumber;
    interBuyDelay: BigNumber;
    buyAmount: BigNumber;
    lastBuyTimestamp: BigNumber;
    buyToken: string;
    isActive: boolean;
    0: string;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: string;
    6: boolean;
  }>;

  "buyStrategies(uint256)"(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<{
    name: string;
    id: BigNumber;
    interBuyDelay: BigNumber;
    buyAmount: BigNumber;
    lastBuyTimestamp: BigNumber;
    buyToken: string;
    isActive: boolean;
    0: string;
    1: BigNumber;
    2: BigNumber;
    3: BigNumber;
    4: BigNumber;
    5: string;
    6: boolean;
  }>;

  buyStrategyChakra(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "buyStrategyChakra(uint256)"(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  calcToChakra(
    _chakra: string,
    _currency: string,
    _poolAmount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  "calcToChakra(address,address,uint256)"(
    _chakra: string,
    _currency: string,
    _poolAmount: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  chakraManager(
    arg0: string,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "chakraManager(address)"(
    arg0: string,
    overrides?: TransactionOverrides
  ): Promise<string>;

  chakras(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "chakras(uint256)"(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  fromChakra(
    _chakra: string,
    _sellToken: string,
    _poolAmountOut: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  "fromChakra(address,address,uint256)"(
    _chakra: string,
    _sellToken: string,
    _poolAmountOut: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<BigNumber>;

  "fromChakra(tuple)"(
    _arg: {
      _chakra: string;
      _sellToken: string;
      _sellStrategyId: BigNumberish;
      _sellTokenIndex: BigNumberish;
      _poolAmount: BigNumberish;
      _minQuoteToken: BigNumberish;
    },
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getBuyStrategies(
    overrides?: TransactionOverrides
  ): Promise<
    {
      name: string;
      id: BigNumber;
      interBuyDelay: BigNumber;
      buyAmount: BigNumber;
      lastBuyTimestamp: BigNumber;
      buyToken: string;
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: string;
      6: boolean;
    }[]
  >;

  "getBuyStrategies()"(
    overrides?: TransactionOverrides
  ): Promise<
    {
      name: string;
      id: BigNumber;
      interBuyDelay: BigNumber;
      buyAmount: BigNumber;
      lastBuyTimestamp: BigNumber;
      buyToken: string;
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: BigNumber;
      3: BigNumber;
      4: BigNumber;
      5: string;
      6: boolean;
    }[]
  >;

  getChakras(overrides?: TransactionOverrides): Promise<string[]>;

  "getChakras()"(overrides?: TransactionOverrides): Promise<string[]>;

  getSellStrategies(
    overrides?: TransactionOverrides
  ): Promise<
    {
      name: string;
      id: BigNumber;
      prices: BigNumber[];
      sellTokens: string[];
      isExecuted: boolean[];
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: BigNumber[];
      3: string[];
      4: boolean[];
      5: boolean;
    }[]
  >;

  "getSellStrategies()"(
    overrides?: TransactionOverrides
  ): Promise<
    {
      name: string;
      id: BigNumber;
      prices: BigNumber[];
      sellTokens: string[];
      isExecuted: boolean[];
      isActive: boolean;
      0: string;
      1: BigNumber;
      2: BigNumber[];
      3: string[];
      4: boolean[];
      5: boolean;
    }[]
  >;

  init(
    _balancerFactory: string,
    _implementation: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "init(address,address)"(
    _balancerFactory: string,
    _implementation: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  isChakra(arg0: string, overrides?: TransactionOverrides): Promise<boolean>;

  "isChakra(address)"(
    arg0: string,
    overrides?: TransactionOverrides
  ): Promise<boolean>;

  isPaused(overrides?: TransactionOverrides): Promise<boolean>;

  "isPaused()"(overrides?: TransactionOverrides): Promise<boolean>;

  newProxiedSmartPool(
    _name: string,
    _symbol: string,
    _initialSupply: BigNumberish,
    _tokens: string[],
    _amounts: BigNumberish[],
    _weights: BigNumberish[],
    _cap: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "newProxiedSmartPool(string,string,uint256,address[],uint256[],uint256[],uint256)"(
    _name: string,
    _symbol: string,
    _initialSupply: BigNumberish,
    _tokens: string[],
    _amounts: BigNumberish[],
    _weights: BigNumberish[],
    _cap: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  saveEth(overrides?: TransactionOverrides): Promise<ContractTransaction>;

  "saveEth()"(overrides?: TransactionOverrides): Promise<ContractTransaction>;

  saveToken(
    _token: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "saveToken(address)"(
    _token: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  sellStrategies(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<{
    name: string;
    id: BigNumber;
    isActive: boolean;
    0: string;
    1: BigNumber;
    2: boolean;
  }>;

  "sellStrategies(uint256)"(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<{
    name: string;
    id: BigNumber;
    isActive: boolean;
    0: string;
    1: BigNumber;
    2: boolean;
  }>;

  sellStrategyChakra(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  "sellStrategyChakra(uint256)"(
    arg0: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<string>;

  setImplementation(
    _implementation: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "setImplementation(address)"(
    _implementation: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  smartPoolImplementation(overrides?: TransactionOverrides): Promise<string>;

  "smartPoolImplementation()"(
    overrides?: TransactionOverrides
  ): Promise<string>;

  toChakra(
    _arg: {
      chakra: string;
      baseToken: string;
      buyStrategyId: BigNumberish;
      poolAmount: BigNumberish;
      baseAmount: BigNumberish;
    },
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "toChakra(tuple)"(
    _arg: {
      chakra: string;
      baseToken: string;
      buyStrategyId: BigNumberish;
      poolAmount: BigNumberish;
      baseAmount: BigNumberish;
    },
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  togglePause(overrides?: TransactionOverrides): Promise<ContractTransaction>;

  "togglePause()"(
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  transferOwnership(
    _newOwner: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    _newOwner: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  updateBuystrategy(
    _chakra: string,
    _buyToken: string,
    _buyStrategyId: BigNumberish,
    _interBuyDelay: BigNumberish,
    _buyAmount: BigNumberish,
    _isActive: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "updateBuystrategy(address,address,uint256,uint256,uint256,bool)"(
    _chakra: string,
    _buyToken: string,
    _buyStrategyId: BigNumberish,
    _interBuyDelay: BigNumberish,
    _buyAmount: BigNumberish,
    _isActive: boolean,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    BuyStrategyAdded(
      chakra: string | null,
      buyStrategyName: null,
      buyStrategyId: BigNumberish | null
    ): EventFilter;

    BuyStrategyDisabled(
      chakra: string | null,
      buyStrategyId: BigNumberish | null
    ): EventFilter;

    BuyStrategyEnabled(
      chakra: string | null,
      buyStrategyId: BigNumberish | null
    ): EventFilter;

    BuyStrategyUpdated(
      chakra: string | null,
      sellStrategyId: BigNumberish | null
    ): EventFilter;

    OwnerChanged(
      previousOwner: string | null,
      newOwner: string | null
    ): EventFilter;

    SellStrategyAdded(
      chakra: string | null,
      sellStrategyName: null,
      sellStrategyId: BigNumberish | null
    ): EventFilter;

    SellStrategyDisabled(
      chakra: string | null,
      sellStrategyId: BigNumberish | null
    ): EventFilter;

    SellStrategyEnabled(
      chakra: string | null,
      sellStrategyId: BigNumberish | null
    ): EventFilter;

    SellStrategyUpdated(
      chakra: string | null,
      sellStrategyId: BigNumberish | null
    ): EventFilter;

    SmartPoolCreated(
      chakra: string | null,
      chakraManager: string | null,
      name: null,
      symbol: null
    ): EventFilter;
  };

  estimate: {
    addBuyStrategy(
      _chakra: string,
      _buyToken: string,
      _name: string,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "addBuyStrategy(address,address,string,uint256,uint256)"(
      _chakra: string,
      _buyToken: string,
      _name: string,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    addSellStrategy(
      _chakra: string,
      _name: string,
      _sellTokens: string[],
      _prices: BigNumberish[],
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "addSellStrategy(address,string,address[],uint256[])"(
      _chakra: string,
      _name: string,
      _sellTokens: string[],
      _prices: BigNumberish[],
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    balancerFactory(overrides?: TransactionOverrides): Promise<BigNumber>;

    "balancerFactory()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    buyStrategies(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "buyStrategies(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    buyStrategyChakra(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "buyStrategyChakra(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    calcToChakra(
      _chakra: string,
      _currency: string,
      _poolAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "calcToChakra(address,address,uint256)"(
      _chakra: string,
      _currency: string,
      _poolAmount: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    chakraManager(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "chakraManager(address)"(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    chakras(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "chakras(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    fromChakra(
      _chakra: string,
      _sellToken: string,
      _poolAmountOut: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "fromChakra(address,address,uint256)"(
      _chakra: string,
      _sellToken: string,
      _poolAmountOut: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "fromChakra(tuple)"(
      _arg: {
        _chakra: string;
        _sellToken: string;
        _sellStrategyId: BigNumberish;
        _sellTokenIndex: BigNumberish;
        _poolAmount: BigNumberish;
        _minQuoteToken: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    getBuyStrategies(overrides?: TransactionOverrides): Promise<BigNumber>;

    "getBuyStrategies()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    getChakras(overrides?: TransactionOverrides): Promise<BigNumber>;

    "getChakras()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    getSellStrategies(overrides?: TransactionOverrides): Promise<BigNumber>;

    "getSellStrategies()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    init(
      _balancerFactory: string,
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "init(address,address)"(
      _balancerFactory: string,
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    isChakra(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "isChakra(address)"(
      arg0: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    isPaused(overrides?: TransactionOverrides): Promise<BigNumber>;

    "isPaused()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    newProxiedSmartPool(
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "newProxiedSmartPool(string,string,uint256,address[],uint256[],uint256[],uint256)"(
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    saveEth(overrides?: TransactionOverrides): Promise<BigNumber>;

    "saveEth()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    saveToken(
      _token: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "saveToken(address)"(
      _token: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    sellStrategies(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "sellStrategies(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    sellStrategyChakra(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "sellStrategyChakra(uint256)"(
      arg0: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    setImplementation(
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "setImplementation(address)"(
      _implementation: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    smartPoolImplementation(
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "smartPoolImplementation()"(
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    toChakra(
      _arg: {
        chakra: string;
        baseToken: string;
        buyStrategyId: BigNumberish;
        poolAmount: BigNumberish;
        baseAmount: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "toChakra(tuple)"(
      _arg: {
        chakra: string;
        baseToken: string;
        buyStrategyId: BigNumberish;
        poolAmount: BigNumberish;
        baseAmount: BigNumberish;
      },
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    togglePause(overrides?: TransactionOverrides): Promise<BigNumber>;

    "togglePause()"(overrides?: TransactionOverrides): Promise<BigNumber>;

    transferOwnership(
      _newOwner: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      _newOwner: string,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    updateBuystrategy(
      _chakra: string,
      _buyToken: string,
      _buyStrategyId: BigNumberish,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      _isActive: boolean,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "updateBuystrategy(address,address,uint256,uint256,uint256,bool)"(
      _chakra: string,
      _buyToken: string,
      _buyStrategyId: BigNumberish,
      _interBuyDelay: BigNumberish,
      _buyAmount: BigNumberish,
      _isActive: boolean,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
