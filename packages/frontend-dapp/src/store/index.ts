import { config } from "../utils/Config";
import CharkaInfo from "../utils/FetchCharkaInfo";
import {
  fetchWalletTokens,
  fetchAllTokens,
  fetchTokenPrices,
  fetchHistoricTokenPrices,
} from "../utils/FetchWalletTokens";

import Onboard from "bnc-onboard";
import { API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";
import Notify from "bnc-notify";
// Ethers
import ethers from "ethers";

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ethers: null,
    provider: null,
    signer: null,
    account: null,
    userAddress: null,
    currentNetwork: null,
    currentNetworkId: null,
    notify: null,
    onboard: null,
    wallet: null,
    charkaInfo: null,
    protocolBalances: null,
    walletTokens: [],
    chakras: [],
    allTokens: [],
  },
  mutations: {
    setSigner(state, signer) {
      state.signer = signer;
      console.log("signer set to: ", state.signer);
    },
    setCharkaInfo(state, charkaInfo) {
      state.charkaInfo = charkaInfo;
      console.log("signer set to: ", state.signer);
    },
    setUserAddress(state, address) {
      state.userAddress = address;
      console.log("user address set to:");
      console.log(state.userAddress);
    },
    setCurrentNetwork(state, network) {
      state.currentNetwork = network;
      console.log("network set to: " + state.currentNetwork);
    },
    setCurrentNetworkId(state, networkId) {
      state.currentNetworkId = networkId;
      console.log("networkId set to: " + state.currentNetworkId);
    },
    setEthers(state, ethers) {
      state.ethers = ethers;
      console.log("ethers set to: ", state.ethers);
    },
    setProvider(state, provider) {
      console.log("provider set to: ", state.provider);
      state.provider = provider;
    },

    setOnboard(state, onboard) {
      console.log("onboard set to: ");
      state.onboard = onboard;
      console.log(state.onboard);
    },
    setWallet(state, wallet) {
      console.log("wallet set to: ");
      state.wallet = wallet;
      console.log(state.wallet);
    },
    setChakras(state, chakras) {
      console.log("chakras set to: ");
      state.chakras = chakras;
      console.log(state.chakras);
    },
    setWalletTokens(state, walletTokens) {
      console.log("walletTokens set to: ");
      state.walletTokens = walletTokens;
      console.log(state.walletTokens);
    },
    setAllTokens(state, allTokens) {
      console.log("allTokens set to: ");
      state.allTokens = allTokens;
      console.log(state.allTokens);
    },
    setProtocolBalances(state, protocolBalances) {
      state.protocolBalances = protocolBalances;
      console.log("protocolBalances set to: ");
      console.log(state.protocolBalances);
    },
  },
  actions: {
    async setUp({ dispatch, state }) {
      console.log("IN SETUP");
      // Setting up Onboard.js
      // await setUpOnboard();
      await dispatch("setUpOnboard");

      // // Setting up the Smart contracts
      // await dispatch("setUpContracts");

      // Fetch all compatible tokens
      await dispatch("getAllTokens");

      // Fetch the user chakras
      await dispatch("getUserChakras");
    },

    async setUpOnboard({ commit, state }) {
      console.log("Onboard.js flow...");
      const SUPPORTED_NETWORK_IDS: number[] = [1, 42];

      const onboardInstance = Onboard({
        dappId: config(state.currentNetwork).onboardConfig.apiKey,
        hideBranding: true,
        networkId: 1, // Default to main net. If on a different network will change with the subscription.
        subscriptions: {
          address: (address: string | null) => {
            commit("setUserAddress", address);
          },
          network: async (networkId: any) => {
            if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
              alert("This dApp will work only with the Mainnet or Kovan network");
            }
            state.onboard?.config({ networkId: networkId });
            commit("setCurrentNetworkId", networkId);
          },
          wallet: async (wallet: Wallet) => {
            if (wallet.provider) {
              const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
              commit("setProvider", ethersProvider);
              commit("setCurrentNetwork", await ethersProvider.getNetwork());
            } else {
              commit("setProvider", null);
              commit("setCurrentNetwork", null);
            }
          },
        },
        walletSelect: config(state.currentNetwork).onboardConfig.onboardWalletSelect,
        walletCheck: config(state.currentNetwork).onboardConfig.walletCheck,
      });

      await onboardInstance.walletSelect();
      await onboardInstance.walletCheck();
      const charkaInfo = new CharkaInfo(state.provider);
      commit("setCharkaInfo", charkaInfo);
      commit("setOnboard", onboardInstance);

      console.log("> Successfully run onboard.js");
    },

    async setUpContracts({ commit, state }) {
      console.log("Setting up Smart Contract instances...");
      //   // Setting up contract info
      //   let tokensAddress = await ContractHelper.getTokenAddress(state.currentNetwork);
      //   commit(mutations.SET_CONTRACT_ADDRESS, tokensAddress.unique);
      //   commit(mutations.SET_MOCK_CONTRACT_ADDRESS, tokensAddress.mock);
      //   // Getting the contract instance
      //   let tokenContractInstance = await ContractHelper.getContractInstance(
      //     state.tokenInfo.tokenContractAddress,
      //     state.ethers,
      //     state.signer,
      //     UniqueUserTokensABI.abi
      //   );
      //   commit(mutations.SET_CONTRACT_INSTANCE, tokenContractInstance);

      //   let mockInstance = await ContractHelper.getContractInstance(
      //     state.mockToken.mockContractAddress,
      //     state.ethers,
      //     state.signer,
      //     MockTokenABI.abi
      //   );
      //   commit(mutations.SET_MOCK_CONTRACT_INSTANCE, mockInstance);

      //   console.log("> Successfully set up Smart Contract instances");
    },

    // LOADING ACTIONS

    async getUserChakras({ commit, state }) {
      console.log("Getting chakras...", state.userAddress);

      // Get BPT from defiSDK
      const portfolioBalances = await state.charkaInfo.fetchProtocolBalance(state.userAddress);

      // Add in additional token information such as price, logo ect from the all tokens object
      let userChakras = portfolioBalances.map((portfolioObject) => {
        return {
          ...portfolioObject,
          underlyingTokens: portfolioObject.underlyingTokens.map((token) => {
            return {
              ...state.allTokens.filter((obj) => {
                return obj.address === token.address;
              })[0],
              ...token,
            };
          }),
        };
      });

      // commit("setProtocolBalances", portfolioBalances);

      const lookback = 30;

      console.log("userChakras", userChakras);
      userChakras.forEach(async (chakras) => {
        console.log("FOR");
        let chakraChartPromises = [];
        chakras.underlyingTokens.forEach((token) => {
          console.log("TOKENZZZ", token);
          chakraChartPromises.push(fetchHistoricTokenPrices(token.address, lookback));
        });
        const allPriceInformation = await Promise.all(chakraChartPromises);
        console.log("userChakras", userChakras);
        console.log("allPriceInformation", allPriceInformation);
      });

      // let chartInfo = await state.charkaInfo.fetchChartInfo(state.userAddress, 30);

      commit("setChakras", userChakras);
      console.log("setChartInfo", state.chakras);
    },

    async getAllTokens({ commit, state }) {
      console.log("Getting setWalletTokens...", state.walletTokens);

      // TODO: parallzalize this call
      const walletTokens = await fetchWalletTokens(state.userAddress);
      console.log("walletTokenswalletTokenswalletTokenswalletTokens", walletTokens);
      console.log("Getting getAllTokens...", state.allTokens);

      const allTokens = await fetchAllTokens();
      console.log("ZETA", await fetchTokenPrices(allTokens.slice(0, 150).map((token) => token.address.toLowerCase())));

      const tokenPricesPromiseResponse = await Promise.all([
        fetchTokenPrices(allTokens.slice(0, 150).map((token) => token.address.toLowerCase())),
        fetchTokenPrices(allTokens.slice(151, 301).map((token) => token.address.toLowerCase())),
        fetchTokenPrices(allTokens.slice(302, allTokens.length - 1).map((token) => token.address.toLowerCase())),
      ]);

      let tokenPrices = {};
      tokenPricesPromiseResponse.forEach((response) => {
        tokenPrices = { ...tokenPrices, ...response };
      });

      console.log("allTokens", allTokens);

      const allTokensRightNetwork = allTokens.filter((token) => {
        return token.chainId === state.currentNetworkId;
      });

      console.log("allTokensRightNetwork", allTokensRightNetwork);

      const joinedTokenArrays = allTokensRightNetwork.map((tokenObject) => {
        console.log("tokenObject.address.toLowerCase()", tokenObject.address.toLowerCase());

        tokenObject.amount = walletTokens[tokenObject.address.toLowerCase()]
          ? walletTokens[tokenObject.address.toLowerCase()]
          : "0";

        tokenObject.amountRounded = walletTokens[tokenObject.address.toLowerCase()]
          ? Number(
              ethers.utils.formatUnits(walletTokens[tokenObject.address.toLowerCase()], tokenObject.decimals)
            ).toFixed(4)
          : Number(0).toFixed(4);

        tokenObject.price = tokenPrices[tokenObject.address.toLowerCase()]
          ? tokenPrices[tokenObject.address.toLowerCase()].usd
          : "0";

        tokenObject.value = (Number(tokenObject.amountRounded) * Number(tokenObject.price)).toFixed(2);

        if (tokenObject.amount !== "0") {
          console.log("tokenObject", tokenObject);
        }
        return tokenObject;
      });
      const sortedWalletBalances = joinedTokenArrays.sort((a, b) => (Number(a.value) < Number(b.value) ? 1 : -1));
      commit("setAllTokens", sortedWalletBalances);
    },
  },
  modules: {},
});
