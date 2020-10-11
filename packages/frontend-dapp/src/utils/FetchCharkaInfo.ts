import { DeFiSDK } from "defi-sdk";

export default class CharkaInfo {
  defiSdk: DeFiSDK;

  constructor(provider: any) {
    console.log("provider", provider);
    this.defiSdk = new DeFiSDK("https://eth-mainnet.zerion.io/");
  }

  async fetchChartInfo(address: string, lookback: number) {
    this.defiSdk.getProtocolNames().then(protocols => console.log(protocols));

    // return await portfolioBalances;
    return [{ address: 0, metaData: { abcde: 1 }, chartData: await this.fetchHistoricTokenPrices("uma", lookback) }];
  }

  async fetchProtocolBalance(address: string) {
    this.defiSdk.getProtocolNames().then(protocols => console.log(protocols));

    const protocol = "Balancer";

    const portfolioBalances: any = await this.defiSdk.getProtocolBalance(
      "0x42b9dF65B219B3dD36FF330A4dD8f327A6Ada990",
      "Balancer"
    );
    console.log("portfolioBalances", portfolioBalances);
    return await portfolioBalances;
  }

  async fetchHistoricTokenPrices(tokenName: string, lookbackDays: number) {
    const query = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart?vs_currency=usd&days=${lookbackDays}`;

    const response = await fetch(query, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    const priceResponse = await response.json();
    return priceResponse.prices;
  }
}
