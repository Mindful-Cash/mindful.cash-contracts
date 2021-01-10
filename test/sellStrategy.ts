// This way of importing is a bit funky. We should fix this in the Mock Contracts package
import { MockTokenFactory } from "@pie-dao/mock-contracts/dist/typechain/MockTokenFactory";
import { MockToken } from "@pie-dao/mock-contracts/typechain/MockToken";
import { ethers, run } from "@nomiclabs/buidler";
ethers.errors.setLogLevel("error"); // HACK prevent ethers from printing 'Multiple definitions for
import { Signer, Wallet, constants } from "ethers";
import { BigNumberish, BigNumber } from "ethers/utils";
import chai from "chai";
import { deployContract, solidity } from "ethereum-waffle";

import { deployBalancerPool, deployBalancerFactory, linkArtifact } from "../utils";
import { Ierc20 } from "../typechain/Ierc20";
import { IbPool } from "../typechain/IbPool";
import { IbPoolFactory } from "../typechain/IbPoolFactory";
import { Ipv2SmartPoolFactory } from "../typechain/Ipv2SmartPoolFactory";
import { MindfulProxyFactory } from "../typechain/MindfulProxyFactory";
import { MindfulProxy } from "../typechain/MindfulProxy";
import { Pv2SmartPool } from "../typechain/PV2SmartPool";
import { Ipv2SmartPool } from "../typechain/Ipv2SmartPool";
import { PProxiedFactoryFactory } from "../typechain/PProxiedFactoryFactory";
import { PProxiedFactory } from "../typechain/PProxiedFactory";
import Pv2SmartPoolArtifact from "../artifacts/Pv2SmartPool.json";
import MindfulProxyArtifact from "../artifacts/MindfulProxy.json";
import PProxiedFactoryArtifact from "../artifacts/PProxiedFactory.json";
import { Ierc20Factory } from "../typechain/Ierc20Factory";
import { TestPcToken } from "../typechain/TestPcToken";
import { TestPcTokenFactory } from "../typechain/TestPcTokenFactory";

chai.use(solidity);
const { expect } = chai;

const INITIAL_SUPPLY = constants.WeiPerEther;
const PLACE_HOLDER_ADDRESS = "0x0000000000000000000000000000000000000001";
const NAME = "DeFi Energy Chakra";
const SYMBOL = "DEC";

describe("Sell strategy", () => {
  let signers: Signer[];

  let mindfulDeployer: string;
  let chakraOwner: string;
  let relayer: string;
  let random: string;

  let pProxiedFactory: PProxiedFactory;
  let mindfulProxy: MindfulProxy;
  let smartpool: Pv2SmartPool;
  let smartpoolProxy: Ipv2SmartPool;
  let tokens: MockToken[];
  let amounts: BigNumberish[] = [];
  let weights: BigNumberish[] = [];
  let umaToken: MockToken;
  let compToken: MockToken;
  let yfiToken: MockToken;
  let usdcToken: MockToken;

  before(async () => {
    tokens = [];
    amounts = [];
    weights = [];

    signers = await ethers.signers();
    mindfulDeployer = await signers[0].getAddress();
    chakraOwner = await signers[1].getAddress();
    relayer = await signers[2].getAddress();
    random = await signers[3].getAddress();

    const balancerFactoryAddress = await deployBalancerFactory(signers[0]);

    mindfulProxy = (await deployContract(signers[0] as Wallet, MindfulProxyArtifact, [], {
      gasLimit: 100000000,
    })) as MindfulProxy;

    pProxiedFactory = (await deployContract(signers[0] as Wallet, PProxiedFactoryArtifact, [], {
      gasLimit: 100000000,
    })) as PProxiedFactory;

    const libraries = await run("deploy-libraries");
    const linkedArtifact = linkArtifact(Pv2SmartPoolArtifact, libraries);

    // Deploy this way to get the coverage provider to pick it up
    smartpool = (await deployContract(signers[0] as Wallet, linkedArtifact, [], {
      gasLimit: 100000000,
    })) as Pv2SmartPool;

    await smartpool.init(PLACE_HOLDER_ADDRESS, "IMP", "IMP", 1337);
    await mindfulProxy.init(pProxiedFactory.address, balancerFactoryAddress, smartpool.address);

    const tokenFactorySigner0 = new MockTokenFactory(signers[0]);
    const tokenFactorySigner1 = new MockTokenFactory(signers[0]);
    const tokenFactorySigner2 = new MockTokenFactory(signers[0]);

    umaToken = await tokenFactorySigner0.deploy('UMA', 'UMA', 18);
    compToken = await tokenFactorySigner0.deploy('COMP', 'COMP', 18);
    yfiToken = await tokenFactorySigner0.deploy('YFI', 'YFI', 18);
    usdcToken = await tokenFactorySigner0.deploy('USDC', 'USDC', 18);

    await umaToken.mint(mindfulDeployer, constants.WeiPerEther.mul(10000000000));
    await compToken.mint(mindfulDeployer, constants.WeiPerEther.mul(10000000000));
    await yfiToken.mint(mindfulDeployer, constants.WeiPerEther.mul(10000000000));
    await umaToken.approve(pProxiedFactory.address, constants.MaxUint256);
    await compToken.approve(pProxiedFactory.address, constants.MaxUint256);
    await yfiToken.approve(pProxiedFactory.address, constants.MaxUint256);

    tokens.push(umaToken);
    tokens.push(compToken);
    tokens.push(yfiToken);

    weights.push(constants.WeiPerEther.mul(3));
    weights.push(constants.WeiPerEther.mul(3));
    weights.push(constants.WeiPerEther.mul(3));
    amounts.push(constants.WeiPerEther.mul(10));
    amounts.push(constants.WeiPerEther.mul(10));
    amounts.push(constants.WeiPerEther.mul(10));

    await mindfulProxy.deployChakra(
      NAME,
      SYMBOL,
      constants.WeiPerEther,
      tokens.map((token) => token.address),
      amounts,
      weights,
      INITIAL_SUPPLY
    );
    expect((await mindfulProxy.getChakras()).length).to.eq(1);
  });

  it('should create a sell startegy', async () => {
    const chakraAddress = (await mindfulProxy.getChakras())[0];

    let startegyName = "Strategy 1";
    let prices = [];
    let sellOtokens = [];

    prices.push(constants.WeiPerEther.mul(10000000000));
    prices.push(constants.WeiPerEther.mul(12000000000));
    prices.push(constants.WeiPerEther.mul(20000000000));
    sellOtokens.push(usdcToken.address);
    sellOtokens.push(usdcToken.address);
    sellOtokens.push(usdcToken.address);

    await mindfulProxy.addSellStrategy(chakraAddress, startegyName, sellOtokens, prices);

    expect((await mindfulProxy.getSellStrategies()).length).to.eq(1);
    expect((await mindfulProxy.getSellStrategies())[0].name).to.eq(startegyName);
    expect(await mindfulProxy.sellStrategyChakra(1)).to.eq(chakraAddress);
  });
  
  it('should update a specific sell strategy price', async () => {
    const chakraAddress = (await mindfulProxy.getChakras())[0];
    const sellStrategyid = '0';
    const  newPrice = constants.WeiPerEther.mul(20000000000);
    const isActive = true;

    await mindfulProxy.updateSellStrategy(chakraAddress, sellStrategyid, 0, newPrice, isActive);

    // expect((await mindfulProxy.getSellStrategies())[0].sellTokens.length).to.eq(2);
  })

  async function getTokenBalances(address: string) {
    const balances: BigNumber[] = [];

    for (const token of tokens) {
      balances.push(await token.balanceOf(address));
    }

    return balances;
  }

  function expectZero(amounts: BigNumber[]) {
    for (const amount of amounts) {
      expect(amount).to.eq(0);
    }
  }

  function createBigNumberArray(length: number, value: BigNumber): BigNumber[] {
    const result: BigNumber[] = [];
    for (let i = 0; i < length; i++) {
      result.push(value);
    }

    return result;
  }
});
