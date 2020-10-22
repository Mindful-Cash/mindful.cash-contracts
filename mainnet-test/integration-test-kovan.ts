// This file runs intergration tests of the MindfulProxy on a mainnet fork to test intergrations with balancer, uniswap
// and the Mindful ecosystem 🧘‍♂️. run a kovan testnet as follows:
// Copy example.env in an .env file then:
//MINDFUL=0x425B6912f20f14D61B7F3cf7130c37B2b11C7A24 npx buidler test ./mainnet-test/integration-test-kovan.ts --network kovan

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

import { MindfulProxyFactory } from "../typechain/MindfulProxyFactory";
import { MindfulProxy } from "../typechain/MindfulProxy";
import { Pv2SmartPool } from "../typechain/PV2SmartPool";
import { MockTokenFactory } from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import { MockToken } from "@pie-dao/mock-contracts/typechain/MockToken";
import { Ipv2SmartPool } from "../typechain/Ipv2SmartPool";
import { Ipv2SmartPoolFactory } from "../typechain/Ipv2SmartPoolFactory";

chai.use(solidity);
const { expect } = chai;

const PLACE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";
const SMART_POOL_FACTORY = "0x8f7F78080219d4066A8036ccD30D588B416a40DB";
const WHALE_ACCOUNT = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
const WETH_TOKEN = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const BAT_TOKEN = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
const LINK_TOKEN = "0x514910771af9ca656af840dff83e8264ecf986ca";
const OMG_TOKEN = "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07";
const ZRX_TOKEN = "0x162c44e53097e7b5aae939b297fffd6bf90d1ee3";
const DAI_TOKEN = "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa";
const USDC_TOKEN = "0xb7a4f3e9097c08da09517b5ab877f7a917224ede";
const WBTC_TOKEN = "0xd3a691c852cdb01e281545a27064741f0b7f6825";

const NAME = "DeFi Energy Chakra";
const SYMBOL = "DEC";
const INITIAL_SUPPLY = constants.WeiPerEther;
const TOKENS: any = [ZRX_TOKEN, USDC_TOKEN, WBTC_TOKEN];
const AMOUNTS: any = ['1000000000000000', '1000000000000000', '1000000000000000'];
const WEIGHTS: any = [constants.WeiPerEther.mul(3), constants.WeiPerEther.mul(3), constants.WeiPerEther.mul(3)];

const timeTraveler = new TimeTraveler(ethereum);

describe("KOVAN TEST", function () {
  this.timeout(10000000);
  
  let signers: Signer[];
  let account: string;
  let whaleSigner: Signer;

  let mindfulProxy: MindfulProxy;
  // let mindfulProxyWhaleSigner: MindfulProxy;
  let smartpool: Pv2SmartPool;
  let smartpoolProxy: Ipv2SmartPool;

  before(async () => {
    signers = await ethers.signers();
    const provider = new ethers.providers.JsonRpcProvider();

    // whaleSigner = provider.getSigner(WHALE_ACCOUNT);
    // console.log("whale address", whaleSigner.getAddress());

    account = await signers[0].getAddress();
    console.log("account", account);

    mindfulProxy = MindfulProxyFactory.connect(process.env.MINDFUL_KOVAN, signers[0]);

    // await timeTraveler.snapshot();
  });
  // beforeEach(async () => {
  //   await timeTraveler.snapshot();
  // });

  // afterEach(async () => {
  //   await timeTraveler.revertSnapshot();
  // });

  it(`Full execution lifecycle`, async () => {
    // 1. Approve tokens

    for (let i = 0; i < TOKENS.length; i++) {
      const token: Ierc20 = Ierc20Factory.connect(TOKENS[i], signers[0]);
      console.log("token", token.address);
      await token.approve(mindfulProxy.address, constants.MaxUint256);
      console.log("balance", (await token.balanceOf(account)).toString());
    }

    // 2. User makes a new Mindful Proxy.
    await mindfulProxy.newProxiedSmartPool(
      NAME,
      SYMBOL,
      INITIAL_SUPPLY,
      TOKENS,
      AMOUNTS,
      WEIGHTS,
      INITIAL_SUPPLY
    );
    expect((await mindfulProxy.getChakras()).length).to.eq(1);
    smartpoolProxy = Ipv2SmartPoolFactory.connect(await mindfulProxy.chakras(0), signers[0]);
    console.log("chakras", await mindfulProxy.getChakras());
  });
});
