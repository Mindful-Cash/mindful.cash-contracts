import { MindfulProxyFactory } from "../../typechain/MindfulProxyFactory";

import { config } from "../utils/Config";
import CharkaInfo from "../utils/FetchCharkaInfo";
import {
  fetchWalletTokens,
  fetchAllTokens,
  fetchTokenPrices,
  fetchHistoricTokenPrices
} from "../utils/FetchWalletTokens";

import Onboard from "bnc-onboard";
import { API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";
import Notify from "bnc-notify";
import ethers from "ethers";
import moment from "moment";

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    etherscanBase: "https://etherscan.io/",
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
    chakras: null,
    allTokens: []
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
    setEthers(state, ethersObj) {
      state.ethers = ethersObj;
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
    }
  },
  actions: {
    async setUp({ dispatch, state }) {
      console.log("IN SETUP");
      // Setting up Onboard.js
      // await setUpOnboard();
      await dispatch("setUpOnboard");

      // Setting up the Smart contracts
      // await dispatch("setUpContracts");

      // Fetch all compatible tokens
      await dispatch("getAllTokens");

      // Fetch the user chakras
      await dispatch("getUserChakras", state.userAddress);
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
            state.onboard?.config({ networkId });
            commit("setCurrentNetworkId", networkId);
          },
          wallet: async (wallet: Wallet) => {
            if (wallet.provider) {
              const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
              commit("setEthers", ethers);
              commit("setProvider", ethersProvider);
              commit("setCurrentNetwork", await ethersProvider.getNetwork());
            } else {
              commit("setProvider", null);
              commit("setCurrentNetwork", null);
            }
          }
        },
        walletSelect: config(state.currentNetwork).onboardConfig.onboardWalletSelect,
        walletCheck: config(state.currentNetwork).onboardConfig.walletCheck
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
      const contractInstance = await MindfulProxyFactory.connect(
        "0x6841db1aa2d922204EE77918924578335B1a0739",
        state.signer
      );

      console.log("contractInstance", contractInstance);
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

    async getUserChakras({ commit, state }, userAddress) {
      console.log("Getting chakras...", userAddress);

      // Get BPT from defiSDK
      const portfolioBalances = await state.charkaInfo.fetchProtocolBalance(userAddress);

      // Add in additional token information such as price, logo ect from the all tokens object
      const userChakras = portfolioBalances.map(portfolioObject => {
        return {
          ...portfolioObject,
          underlyingTokens: portfolioObject.underlyingTokens.map(token => {
            return {
              ...state.allTokens.filter(obj => {
                return obj.address === token.address;
              })[0],
              ...token
            };
          })
        };
      });

      // commit("setProtocolBalances", portfolioBalances);

      const lookback = 90; // 30 day lookback. in future will be configurable.

      console.log("userChakras", userChakras);
      const numDataPoints = 500;
      const currentTimeStamp = Math.floor(Date.now());
      const startingTimeStamp = moment(moment().subtract(lookback, "days")).valueOf();
      const timeBetweenDataPoint = (currentTimeStamp - startingTimeStamp) / numDataPoints;

      function closest(needle, haystack) {
        return haystack.reduce((a, b) => {
          const aDiff = Math.abs(a - needle);
          const bDiff = Math.abs(b - needle);

          if (aDiff === bDiff) {
            return a > b ? a : b;
          } else {
            return bDiff < aDiff ? b : a;
          }
        });
      }
      if (userChakras.length === 0) {
        commit("setChakras", []);
      }
      userChakras.forEach(async (chakra, chakraIndex) => {
        console.log("FOR");
        const chakraChartPromises = [];
        chakra.underlyingTokens.forEach((token, chakraTokenIndex) => {
          // set the price information
          userChakras[chakraIndex].underlyingTokens[chakraTokenIndex].valueInChakra = Number(
            (parseInt(token.amountInCharka, 10) * Number(token.price)).toFixed(2)
          );
          userChakras[chakraIndex].underlyingTokens[chakraTokenIndex].amountInCharkaRounded = Number(
            Number(token.amountInCharka).toFixed(2)
          );

          console.log("TOKENZZZ", token);
          chakraChartPromises.push(fetchHistoricTokenPrices(token.address, lookback));
        });
        const allChartInfo = await Promise.all(chakraChartPromises);
        console.log("userChakras", userChakras);
        console.log("allChartInfo", allChartInfo);

        // build chart information
        allChartInfo.forEach((chartInfo, index) => {
          const chartInfoTimeStamps = chartInfo.map(x => x[0]);
          const cumlativeChartInfo = [];
          for (let i = 0; i < numDataPoints + 1; i++) {
            const dataPointTimeStamp = startingTimeStamp + Number(i * timeBetweenDataPoint);

            let cumlativeValuePoint = 0;

            const closestChartInfoTimeStamp = closest(dataPointTimeStamp, chartInfoTimeStamps);

            // const chartDataPointPrice = chartInfo[]

            const indexOfClosestTimeStamp = chartInfoTimeStamps.indexOf(closestChartInfoTimeStamp);

            const portfolioValueFromTokenAtTimestamp =
              chartInfo.map(x => x[1])[indexOfClosestTimeStamp] * Number(chakra.underlyingTokens[index].amountInCharka);
            cumlativeValuePoint += portfolioValueFromTokenAtTimestamp;

            cumlativeChartInfo.push([
              dataPointTimeStamp, // timestamp
              Number(cumlativeValuePoint).toFixed(0) // cumlative portfolio value at given timest
            ]);
          }

          userChakras[chakraIndex].chartInfo = cumlativeChartInfo;
          userChakras[chakraIndex].dcaStratergies = [
            {
              type: "dcaIn",
              token: {
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                amount: "694230902983134993",
                amountInCharka: "6.511285732428220037",
                amountRounded: "1",
                chainId: 1,
                decimals: 6,
                logoURI: "https://1inch.exchange/assets/tokens/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
                name: "USD Coin",
                price: 1,
                symbol: "USDC",
                value: "1"
              }
            }
          ];

          // Add 7 day timestamp lookback to
          const sevenDayTimestamp = moment(moment().subtract(7, "days")).valueOf();
          const closestChartInfoTimeTo7DaysAgo = closest(sevenDayTimestamp, chartInfoTimeStamps);
          console.log(
            "sevenDayTimestamp",
            sevenDayTimestamp,
            "closestChartInfoTimeTo7DaysAgo",
            closestChartInfoTimeTo7DaysAgo
          );
          console.log("closestChartInfoTimeTo7DaysAgo", closestChartInfoTimeTo7DaysAgo);
          const indexSevenDaysAgo = chartInfoTimeStamps.indexOf(closestChartInfoTimeTo7DaysAgo);
          console.log("ZOINK");
          console.log(
            "numbers",
            Number(userChakras[chakraIndex].underlyingTokens[index].price),
            chartInfo.map(x => x[1])[indexSevenDaysAgo]
          );
          userChakras[chakraIndex].underlyingTokens[index].sevenDayChange = Number(
            Number(
              ((Number(userChakras[chakraIndex].underlyingTokens[index].price) -
                chartInfo.map(x => x[1])[indexSevenDaysAgo]) /
                chartInfo.map(x => x[1])[indexSevenDaysAgo]) *
                100
            ).toFixed(2)
          );
        });

        // calculate the fraction each token within the pool is within the chakra
        userChakras.forEach(async (c, ci) => {
          console.log("FOR");
          let totalChakraValue = 0;
          // calculate total chkara value
          chakra.underlyingTokens.forEach((t, ti) => {
            totalChakraValue += t.valueInChakra;
            console.log("totalChakraValue");
          });
          // set contributions
          chakra.underlyingTokens.forEach((t, ti) => {
            userChakras[ci].underlyingTokens[ti].contribution = Number(
              (t.valueInChakra / totalChakraValue) * 100
            ).toFixed(1);
          });
        });
        commit("setChakras", userChakras);
      });

      // Build the cumlative chart data. For now we sumply use your current token balance over histopric price information
      // in future this needs to be changed to use historic token balances with historic price info.

      console.log(
        "currentTimestamp",
        currentTimeStamp,
        "startingTimeStamp",
        startingTimeStamp,
        "timeBetweenDataPoint",
        timeBetweenDataPoint
      );

      // let chartInfo = await state.charkaInfo.fetchChartInfo(state.userAddress, 30);
    },
    async getSampleUserChakra({ dispatch }) {
      console.log("loading sample user");
      await dispatch("getUserChakras", "0xdf2b2c1df64d58839320a07907d4181f336a737e");
    },

    async getAllTokens({ commit, state }) {
      console.log("Getting setWalletTokens...", state.walletTokens);

      // TODO: parallzalize this call
      const walletTokens = await fetchWalletTokens(state.userAddress);
      console.log("walletTokenswalletTokenswalletTokenswalletTokens", walletTokens);
      console.log("Getting getAllTokens...", state.allTokens);

      const allTokens = await fetchAllTokens();
      console.log("ZETA", await fetchTokenPrices(allTokens.slice(0, 150).map(token => token.address.toLowerCase())));

      const tokenPricesPromiseResponse = await Promise.all([
        fetchTokenPrices(allTokens.slice(0, 150).map(token => token.address.toLowerCase())),
        fetchTokenPrices(allTokens.slice(151, 301).map(token => token.address.toLowerCase())),
        fetchTokenPrices(allTokens.slice(302, allTokens.length - 1).map(token => token.address.toLowerCase()))
      ]);

      let tokenPrices = {};
      tokenPricesPromiseResponse.forEach(response => {
        tokenPrices = { ...tokenPrices, ...response };
      });

      console.log("allTokens", allTokens);

      const allTokensRightNetwork = allTokens.filter(token => {
        return token.chainId === state.currentNetworkId;
      });

      console.log("allTokensRightNetwork", allTokensRightNetwork);

      const joinedTokenArrays = allTokensRightNetwork.map(tokenObject => {
        console.log("tokenObject.address.toLowerCase()", tokenObject.address.toLowerCase());

        tokenObject.amount = walletTokens[tokenObject.address.toLowerCase()]
          ? walletTokens[tokenObject.address.toLowerCase()]
          : "0";

        tokenObject.amountRounded = walletTokens[tokenObject.address.toLowerCase()]
          ? Number(
              Number(
                state.ethers.utils.formatUnits(walletTokens[tokenObject.address.toLowerCase()], tokenObject.decimals)
              ).toFixed(4)
            )
          : Number(0).toFixed(4);

        tokenObject.price = tokenPrices[tokenObject.address.toLowerCase()]
          ? tokenPrices[tokenObject.address.toLowerCase()].usd
          : "0";

        tokenObject.value = Number((Number(tokenObject.amountRounded) * Number(tokenObject.price)).toFixed(2));

        if (tokenObject.amount !== "0") {
          console.log("tokenObject", tokenObject);
        }
        return tokenObject;
      });
      const sortedWalletBalances = joinedTokenArrays
        .sort((a, b) => (Number(a.price) > Number(b.price) ? 1 : -1))
        .sort((a, b) => (Number(a.value) < Number(b.value) ? 1 : -1));
      commit("setAllTokens", sortedWalletBalances);
    }
  },
  modules: {}
});
