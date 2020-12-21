/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import {Contract, ContractFactory, Signer} from "ethers";
import {Provider} from "ethers/providers";
import {UnsignedTransaction} from "ethers/utils/transaction";

import {TransactionOverrides} from ".";
import {PBasicSmartPoolStorage} from "./PBasicSmartPoolStorage";

export class PBasicSmartPoolStorageFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: TransactionOverrides): Promise<PBasicSmartPoolStorage> {
    return super.deploy(overrides) as Promise<PBasicSmartPoolStorage>;
  }
  getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction {
    return super.getDeployTransaction(overrides);
  }
  attach(address: string): PBasicSmartPoolStorage {
    return super.attach(address) as PBasicSmartPoolStorage;
  }
  connect(signer: Signer): PBasicSmartPoolStorageFactory {
    return super.connect(signer) as PBasicSmartPoolStorageFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PBasicSmartPoolStorage {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PBasicSmartPoolStorage;
  }
}

const _abi = [
  {
    inputs: [],
    name: "pbsSlot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const _bytecode =
  "0x60bb610024600b82828239805160001a607314601757fe5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063099e9e2a146038575b600080fd5b603e6050565b60408051918252519081900360200190f35b604080517f504261736963536d617274506f6f6c2e73746f726167652e6c6f636174696f6e815290519081900360200190208156fea2646970667358221220536e239620d148a0a70d41d33cc28f64c8d7c87e058bce0442b0cf8b5270e2ae64736f6c63430006040033";
