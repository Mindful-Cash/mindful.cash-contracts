// This way of importing is a bit funky. We should fix this in the Mock Contracts package
import {MockTokenFactory} from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import {MockToken} from "@pie-dao/mock-contracts/typechain/MockToken";
import {ethers, run} from "@nomiclabs/buidler";
import {Signer, Wallet, constants} from "ethers";
import {BigNumberish} from "ethers/utils";
import chai from "chai";
import {deployContract, solidity} from "ethereum-waffle";

import {deployBalancerPool, deployBalancerFactory, linkArtifact} from "../utils";
import {MindfulProxy} from "../typechain/MindfulProxy";
import {Pv2SmartPool} from "../typechain/Pv2SmartPool";
import PV2SmartPoolArtifact from "../artifacts/PV2SmartPool.json";
import MindfulProxyArtifact from "../artifacts/MindfulProxy.json";

chai.use(solidity);

const INITIAL_SUPPLY = constants.WeiPerEther;
const PLACE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";

describe("MindfulProxy", () => {
  let signers: Signer[];
  let account: string;
  let factory: MindfulProxy;
  const tokenAddresses: string[] = [];
  const amounts: BigNumberish[] = [];
  const weights: BigNumberish[] = [];

  beforeEach(async () => {
    signers = await ethers.signers();
    account = await signers[0].getAddress();

    const balancerFactoryAddress = await deployBalancerFactory(signers[0]);

    factory = (await deployContract(signers[0] as Wallet, MindfulProxyArtifact, [], {
      gasLimit: 100000000,
    })) as MindfulProxy;

    const libraries = await run("deploy-libraries");
    const linkedArtifact = linkArtifact(PV2SmartPoolArtifact, libraries);

    // Deploy this way to get the coverage provider to pick it up
    const implementation = (await deployContract(signers[0] as Wallet, linkedArtifact, [], {
      gasLimit: 100000000,
    })) as Pv2SmartPool;

    await implementation.init(PLACE_HOLDER_ADDRESS, "IMP", "IMP", 1337);
    await factory.init(balancerFactoryAddress, implementation.address);

    const tokenFactory = new MockTokenFactory(signers[0]);
    for (let i = 0; i < 3; i++) {
      const token: MockToken = await tokenFactory.deploy(`Mock ${i}`, `M${i}`, 18);
      await token.mint(account, constants.WeiPerEther.mul(1000000));
      await token.approve(factory.address, constants.MaxUint256);
      tokenAddresses.push(token.address);
      weights.push(constants.WeiPerEther.mul(3));
      amounts.push(constants.WeiPerEther.mul(10));
    }
  });

  it("Creating a new proxied pool should work", async () => {
    await factory.newProxiedSmartPool(
      "TEST",
      "TST",
      constants.WeiPerEther,
      tokenAddresses,
      amounts,
      weights,
      INITIAL_SUPPLY
    );
  });
});
