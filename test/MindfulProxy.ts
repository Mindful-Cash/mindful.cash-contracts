// This way of importing is a bit funky. We should fix this in the Mock Contracts package
import { MockTokenFactory } from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import { MockToken } from "@pie-dao/mock-contracts/typechain/MockToken";
import { ethers, run } from "@nomiclabs/buidler";
import { Signer, Wallet, constants } from "ethers";
import { BigNumberish } from "ethers/utils";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";

import { deployBalancerPool, deployBalancerFactory, linkArtifact } from "../utils";
import { IbPool } from "../typechain/IbPool";
import { Ierc20 } from "../typechain/Ierc20";
import { IbPoolFactory } from "../typechain/IbPoolFactory";
import { MindfulProxy } from "../typechain/MindfulProxy";
import { Pv2SmartPool } from "../typechain/Pv2SmartPool";
import Ipv2SmartPool from "../typechain/Ipv2SmartPool";
import Pv2SmartPoolArtifact from "../artifacts/Pv2SmartPool.json";
import MindfulProxyArtifact from "../artifacts/MindfulProxy.json";

chai.use(solidity);

const INITIAL_SUPPLY = constants.WeiPerEther;
const PLACE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";

describe("MindfulProxy", () => {
  let signers: Signer[];
  let account: string;
  let mindfulProxy: MindfulProxy;
  // let bPool: IbPool;
  let smartpool: Pv2SmartPool;
  // let smartpoolProxy: Ipv2SmartPool;
  let tokenAddresses: string[] = [];
  let amounts: BigNumberish[] = [];
  let weights: BigNumberish[] = [];
  beforeEach(async () => {
    tokenAddresses = [];
    amounts = [];
    weights = [];

    signers = await ethers.signers();
    account = await signers[0].getAddress();

    const balancerFactoryAddress = await deployBalancerFactory(signers[0]);

    mindfulProxy = (await deployContract(signers[0] as Wallet, MindfulProxyArtifact, [], {
      gasLimit: 100000000,
    })) as MindfulProxy;

    const libraries = await run("deploy-libraries");
    const linkedArtifact = linkArtifact(Pv2SmartPoolArtifact, libraries);

    // Deploy this way to get the coverage provider to pick it up
    smartpool = (await deployContract(signers[0] as Wallet, linkedArtifact, [], {
      gasLimit: 100000000,
    })) as PV2SmartPool;

    await smartpool.init(PLACE_HOLDER_ADDRESS, "IMP", "IMP", 1337);
    await mindfulProxy.init(balancerFactoryAddress, smartpool.address);

    const tokenFactory = new MockTokenFactory(signers[0]);
    for (let i = 0; i < 3; i++) {
      const token: MockToken = await tokenFactory.deploy(`Mock ${i}`, `M${i}`, 18);
      await token.mint(account, constants.WeiPerEther.mul(10000000000));
      await token.approve(mindfulProxy.address, constants.MaxUint256);
      tokenAddresses.push(token.address);
      weights.push(constants.WeiPerEther.mul(3));
      amounts.push(constants.WeiPerEther.mul(10));
    }
  });

  it("Creating a new proxied pool should work", async () => {
    console.log("mindfulProxyzzz", mindfulProxy.address);

    await mindfulProxy.newProxiedSmartPool(
      "TEST",
      "TST",
      constants.WeiPerEther,
      tokenAddresses,
      amounts,
      weights,
      INITIAL_SUPPLY
    );
  });
  it("new proxied pool ownership", async () => {
    console.log("mindfulProxyzzz", mindfulProxy.address);
    await mindfulProxy.newProxiedSmartPool(
      "TEST",
      "TST",
      constants.WeiPerEther,
      tokenAddresses,
      amounts,
      weights,
      INITIAL_SUPPLY
    );
    console.log("JUST GBEFORFE");
    smartpoolProxy = Ipv2SmartPool.connect(await mindfulProxy.pools(0), signers[0]);
    console.log(bPool);
    // const token: Pv2SmartPool;
  });
  console.log("SSSAA");
});
