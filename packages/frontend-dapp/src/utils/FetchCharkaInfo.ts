import { DeFiSDK } from "defi-sdk";
import ethers from "ethers";
export default class CharkaInfo {
  defiSdk: DeFiSDK;

  constructor(provider: any) {
    console.log("provider", provider);
    this.defiSdk = new DeFiSDK("https://eth-mainnet.zerion.io/");
  }

  async fetchProtocolBalance(address: string) {
    console.log("fetchProtocolBalance", this.defiSdk);
    const portfolioBalances: any = await this.defiSdk.adapterRegistry.getAdapterBalance(
      "0xf1Ecc163903FB69Cce46D408E171C89EB7Ca1899", // account address
      "0x581ae5af7afa6f8171bbf40d1981779f168a9523", // balancer adapter address
      ["0x80cba5ba9259c08851d94d6bf45e248541fb3e86"] // pool address (chakra) owned by (DAI/WETH)
    );
    console.log("getAdapterBalance", portfolioBalances);

    const processedPortfolioBalances = portfolioBalances.balances.map((portfolioBalance) => {
      return {
        metaData: {
          smartPoolAddress: portfolioBalance.base.metadata.token,
          nameOfBPT: portfolioBalance.base.metadata.name,
          symbolOfBPT: portfolioBalance.base.metadata.name,
          numberOfBPT: ethers.utils
            .formatUnits(portfolioBalance.base.amount, portfolioBalance.base.metadata.decimals)
            .toString(),
        },
        underlyingTokens: portfolioBalance.underlying.map((underlyingToken) => {
          return {
            address: underlyingToken.metadata.token,
            amountInCharka: ethers.utils
              .formatUnits(underlyingToken.amount, underlyingToken.metadata.decimals)
              .toString(),
          };
        }),
      };
    });

    console.log("processedPortfolioBalances", processedPortfolioBalances);
    return await processedPortfolioBalances;
  }
}
