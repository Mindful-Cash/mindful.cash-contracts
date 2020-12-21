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

interface IpProxiedFactoryInterface extends Interface {
  functions: {
    init: TypedFunctionDescription<{
      encode([_balancerFactory, _implementation]: [string, string]): string;
    }>;

    newProxiedSmartPool: TypedFunctionDescription<{
      encode([
        _degen,
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
        string,
        BigNumberish,
        string[],
        BigNumberish[],
        BigNumberish[],
        BigNumberish
      ]): string;
    }>;
  };

  events: {};
}

export class IpProxiedFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): IpProxiedFactory;
  attach(addressOrName: string): IpProxiedFactory;
  deployed(): Promise<IpProxiedFactory>;

  on(event: EventFilter | string, listener: Listener): IpProxiedFactory;
  once(event: EventFilter | string, listener: Listener): IpProxiedFactory;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): IpProxiedFactory;
  removeAllListeners(eventName: EventFilter | string): IpProxiedFactory;
  removeListener(eventName: any, listener: Listener): IpProxiedFactory;

  interface: IpProxiedFactoryInterface;

  functions: {
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

    newProxiedSmartPool(
      _degen: string,
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    "newProxiedSmartPool(address,string,string,uint256,address[],uint256[],uint256[],uint256)"(
      _degen: string,
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

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

  newProxiedSmartPool(
    _degen: string,
    _name: string,
    _symbol: string,
    _initialSupply: BigNumberish,
    _tokens: string[],
    _amounts: BigNumberish[],
    _weights: BigNumberish[],
    _cap: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  "newProxiedSmartPool(address,string,string,uint256,address[],uint256[],uint256[],uint256)"(
    _degen: string,
    _name: string,
    _symbol: string,
    _initialSupply: BigNumberish,
    _tokens: string[],
    _amounts: BigNumberish[],
    _weights: BigNumberish[],
    _cap: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {};

  estimate: {
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

    newProxiedSmartPool(
      _degen: string,
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;

    "newProxiedSmartPool(address,string,string,uint256,address[],uint256[],uint256[],uint256)"(
      _degen: string,
      _name: string,
      _symbol: string,
      _initialSupply: BigNumberish,
      _tokens: string[],
      _amounts: BigNumberish[],
      _weights: BigNumberish[],
      _cap: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<BigNumber>;
  };
}
