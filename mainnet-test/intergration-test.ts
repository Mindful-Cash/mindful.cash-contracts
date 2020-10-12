import { ethers, run } from "@nomiclabs/buidler";
import { deployBalancerPool, deployBalancerFactory, linkArtifact } from "../utils";
import { parseEther, BigNumber, bigNumberify } from "ethers/utils";
import { Signer, Wallet, utils, constants, ContractTransaction } from "ethers";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";
// import { PCappedSmartPool } from "../typechain/PCappedSmartPool";
// import { PCappedSmartPoolFactory } from "../typechain/PCappedSmartPoolFactory";
// import { IBPoolFactory } from "../typechain/IBPoolFactory";
// import { IERC20Factory } from "../typechain/IERC20Factory";
// import { IERC20 } from "../typechain/IERC20";
// import { IBPool } from "../typechain/IBPool";

import Pv2SmartPoolArtifact from "../artifacts/Pv2SmartPool.json";
import MindfulProxyArtifact from "../artifacts/MindfulProxy.json";

import { MindfulProxy } from "../typechain/MindfulProxy";
import { Pv2SmartPool } from "../typechain/PV2SmartPool";
import { MockTokenFactory } from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import { MockToken } from "@pie-dao/mock-contracts/typechain/MockToken";

chai.use(solidity);
const { expect } = chai;

const PLACE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";
const SMART_POOL_FACTORY = "0xed52D8E202401645eDAD1c0AA21e872498ce47D0";
const USDC_TOKEN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const YFI_TOKEN = "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e";
const WBTC_TOKEN = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

describe("MAINNET TEST", function () {
  this.timeout(10000000);
  let signers: Signer[];
  let account: string;

  let mindfulProxy: MindfulProxy;
  let smartpool: Pv2SmartPool;

  before(async () => {
    signers = await ethers.signers();
    account = await signers[0].getAddress();
    console.log(account);

    const mindfulProxyDeployer: any = new ethers.ContractFactory(
      MindfulProxyArtifact.abi,
      MindfulProxyArtifact.bytecode,
      signers[0]
    );

    mindfulProxy = await mindfulProxyDeployer.deploy();

    console.log("deployed mindful proxy", mindfulProxy.address);

    const libraries = await run("deploy-libraries");
    console.log("Libs deployed");

    const linkedArtifact = linkArtifact(Pv2SmartPoolArtifact, libraries);

    const smartPoolDeployer: any = new ethers.ContractFactory(linkedArtifact.abi, linkedArtifact.bytecode, signers[0]);

    // Notice we pass in "Hello World" as the parameter to the constructor
    smartpool = await smartPoolDeployer.deploy();

    console.log("smartpool deployed", smartpool.address);

    await smartpool.init(PLACE_HOLDER_ADDRESS, "IMP", "IMP", 1337);
    await mindfulProxy.init(SMART_POOL_FACTORY, smartpool.address);
  });

  it(`Full execution lifecycle`, async () => {});
});
