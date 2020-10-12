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

    const portfolioBalances: any = await this.defiSdk.getProtocolBalances(
      "0x42b9dF65B219B3dD36FF330A4dD8f327A6Ada990",
      ["Balancer"]
    );
    console.log("getProtocolBalance", portfolioBalances);

    console.log("defiSdk", this.defiSdk);
    const portfolioBalances1: any = await this.defiSdk.adapterRegistry.getAdapterBalance(
      "0x42b9df65b219b3dd36ff330a4dd8f327a6ada990", // account address
      "0x581ae5af7afa6f8171bbf40d1981779f168a9523", // balancer adapter address
      ["0x53b89ce35928dda346c574d9105a5479cb87231c", "0x987d7cc04652710b74fff380403f5c02f82e290a"]
    );
    console.log("getAdapterBalance", portfolioBalances1);
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
