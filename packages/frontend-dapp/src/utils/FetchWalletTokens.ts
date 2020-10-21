const fetchWalletTokens = async (userAddress: string) => {
  console.log("fetchWalletTokensXXXXX");
  // Fetch tokens from web3api
  const query = `https://web3api.io/api/v2/addresses/${userAddress}/token-balances/latest`;

  console.log("REASPONNNNNSSE");
  const response = await fetch(query, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-amberdata-blockchain-id": "ethereum-mainnet",
      "x-api-key": `UAKc873f4aac1791df4e7f488e58ffaefde` //`${process.env.VUE_APP_AMBER_API || "UAKc873f4aac1791df4e7f488e58ffaefde"}`
    }
  });

  const walletTokens = await response.json();
  console.log("walletTokens", walletTokens);

  const processedWalletTokens = {};
  walletTokens.payload.records.forEach(record => {
    if (record.isERC20) processedWalletTokens[record.address] = record.amount;
  });

  console.log("processedWalletTokens", processedWalletTokens);
  return processedWalletTokens;
};

const fetchAllTokens = async () => {
  console.log("the big fetcher");
  const query = `https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link`;
  const response = await fetch(query, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const tokenList = await response.json();

  console.log("tokenListXXXXXXXXX", tokenList);
  return tokenList.tokens;
};

const fetchTokenPrices = async (tokens: []) => {
  console.log("tthe price fetcher");
  console.log("tokens", JSON.stringify(tokens));
  const query = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokens.join(
    "%2C"
  )}&vs_currencies=usd
`;
  console.log("query", query);
  const response = await fetch(query, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const tokensPrices = await response.json();

  console.log("tokensPricesXXXXXXXXX", tokensPrices);
  return tokensPrices;
};

const fetchHistoricTokenPrices = async (tokenAddress: string, lookbackDays: number) => {
  const query = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}/market_chart/?vs_currency=usd&days=${lookbackDays}`;

  const response = await fetch(query, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  const priceResponse = await response.json();
  return priceResponse.prices;
};

export { fetchWalletTokens, fetchAllTokens, fetchTokenPrices, fetchHistoricTokenPrices };
