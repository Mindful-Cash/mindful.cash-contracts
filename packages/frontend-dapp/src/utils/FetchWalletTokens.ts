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

export { fetchWalletTokens, fetchAllTokens };
