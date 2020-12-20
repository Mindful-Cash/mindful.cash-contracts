// This file runs intergration tests of the MindfulProxy on a mainnet fork to test intergrations with balancer, uniswap
// and the Mindful ecosystem 🧘‍♂️. run a main net fork as follows:
// ganache-cli --fork https://mainnet.infura.io/v3/58073b4a32df4105906c702f167b91d2 --unlock 0xF977814e90dA44bFA03b6295A0616a897441aceC --port 8545
// npx buidler test ./mainnet-test/intergration-test.ts --network local

import { ethers, run, ethereum } from "@nomiclabs/buidler";
import { deployBalancerPool, deployBalancerFactory, linkArtifact, TimeTraveler } from "../utils";
import { parseEther, BigNumber, bigNumberify } from "ethers/utils";
import { Signer, Wallet, utils, constants, ContractTransaction } from "ethers";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";
// import { PCappedSmartPool } from "../typechain/PCappedSmartPool";
// import { PCappedSmartPoolFactory } from "../typechain/PCappedSmartPoolFactory";
// import { IBPoolFactory } from "../typechain/IBPoolFactory";
import { Ierc20Factory } from "../typechain/IERC20Factory";
import { Ierc20 } from "../typechain/IERC20";
// import { IBPool } from "../typechain/IBPool";

import Pv2SmartPoolArtifact from "../artifacts/Pv2SmartPool.json";
import MindfulProxyArtifact from "../artifacts/MindfulProxy.json";
import PProxiedFactoryArtifact from "../artifacts/PProxiedFactory.json";

import { MindfulProxyFactory } from "../typechain/MindfulProxyFactory";
import { MindfulProxy } from "../typechain/MindfulProxy";
import { PProxiedFactory } from "../typechain/PProxiedFactory";
import { Pv2SmartPool } from "../typechain/PV2SmartPool";
import { MockTokenFactory } from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import { MockToken } from "@pie-dao/mock-contracts/typechain/MockToken";
import { Ipv2SmartPool } from "../typechain/Ipv2SmartPool";
import { Ipv2SmartPoolFactory } from "../typechain/Ipv2SmartPoolFactory";

chai.use(solidity);
const { expect } = chai;

const PLACE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";
const SMART_POOL_FACTORY = "0xed52D8E202401645eDAD1c0AA21e872498ce47D0";
const WHALE_ACCOUNT = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
const WETH_TOKEN = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const BAT_TOKEN = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
const USDC_TOKEN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const LINK_TOKEN = "0x514910771af9ca656af840dff83e8264ecf986ca";
const OMG_TOKEN = "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07";

const NAME = "DeFi Energy Chakra";
const SYMBOL = "DEC";
const INITIAL_SUPPLY = constants.WeiPerEther;
const TOKENS: any = [BAT_TOKEN, LINK_TOKEN, OMG_TOKEN];
const AMOUNTS: any = [constants.WeiPerEther.mul(10), constants.WeiPerEther.mul(10), constants.WeiPerEther.mul(10)];
const WEIGHTS: any = [constants.WeiPerEther.mul(3), constants.WeiPerEther.mul(3), constants.WeiPerEther.mul(3)];

const timeTraveler = new TimeTraveler(ethereum);

describe("MAINNET TEST", function() {
  this.timeout(10000000);
  let signers: Signer[];
  let account: string;
  let whaleSigner: Signer;

  let mindfulProxy: MindfulProxy;
  let pProxiedFactory: PProxiedFactory;
  let mindfulProxyWhaleSigner: MindfulProxy;
  let smartpool: Pv2SmartPool;
  let smartpoolProxy: Ipv2SmartPool;

  before(async () => {
    signers = await ethers.signers();
    const provider = new ethers.providers.JsonRpcProvider();

    whaleSigner = provider.getSigner(WHALE_ACCOUNT);
    console.log("whale address", whaleSigner.getAddress());

    account = await signers[0].getAddress();
    console.log("account", account);

    const mindfulProxyDeployer: any = new ethers.ContractFactory(
      MindfulProxyArtifact.abi,
      MindfulProxyArtifact.bytecode,
      signers[0]
    );

    mindfulProxy = await mindfulProxyDeployer.deploy();

    const pProxiedDeployer: any = new ethers.ContractFactory(
      PProxiedFactoryArtifact.abi,
      PProxiedFactoryArtifact.bytecode,
      signers[0]
    );

    pProxiedFactory = await pProxiedDeployer.deploy();

    mindfulProxyWhaleSigner = MindfulProxyFactory.connect(mindfulProxy.address, whaleSigner);

    console.log("deployed mindful proxy", mindfulProxy.address);

    const libraries = await run("deploy-libraries");
    console.log("Libs deployed");

    const linkedArtifact = linkArtifact(Pv2SmartPoolArtifact, libraries);

    const smartPoolDeployer: any = new ethers.ContractFactory(linkedArtifact.abi, linkedArtifact.bytecode, signers[0]);

    smartpool = await smartPoolDeployer.deploy();

    console.log("smartpool deployed", smartpool.address);

    await smartpool.init(PLACE_HOLDER_ADDRESS, "IMP", "IMP", 1337);

    console.log("Should get here");
    console.log("PProxiedFactory.address", pProxiedFactory.address);

    await mindfulProxy.init(pProxiedFactory.address, SMART_POOL_FACTORY, smartpool.address);
    console.log("end of setup");

    await timeTraveler.snapshot();
  });
  beforeEach(async () => {
    await timeTraveler.snapshot();
  });

  afterEach(async () => {
    await timeTraveler.revertSnapshot();
  });

  it(`Full execution lifecycle`, async () => {
    // 1. Approve tokens

    for (let i = 0; i < TOKENS.length; i++) {
      const token: Ierc20 = Ierc20Factory.connect(TOKENS[i], whaleSigner);
      console.log("token", token.address);
      await token.approve(mindfulProxy.address, constants.MaxUint256);
      console.log("balance", (await token.balanceOf(WHALE_ACCOUNT)).toString());
    }

    // 2. User makes a new Mindful Proxy.
    await mindfulProxyWhaleSigner.deployChakra(NAME, SYMBOL, INITIAL_SUPPLY, TOKENS, AMOUNTS, WEIGHTS, INITIAL_SUPPLY);
    expect((await mindfulProxy.getChakras()).length).to.eq(1);
    smartpoolProxy = Ipv2SmartPoolFactory.connect(await mindfulProxy.chakras(0), whaleSigner);
    console.log("chakras", await mindfulProxy.getChakras());
  });
});
