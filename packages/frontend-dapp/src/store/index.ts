// Onboard JS stuff
import Onboard from "bnc-onboard";
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
    contentIdCounter: 2,
    account: null,
    userAddress: null,
    userProfile: { firstName: null, lastName: null, set: false },
    currentNetwork: null,
    notify: null,
    onboard: null,
    wallet: null,
    userProfileBox: null
  },
  mutations: {
    setSigner(state, signer) {
      state.signer = signer;
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
    setEthers(state, ethers) {
      state.ethers = ethers;
      console.log("ethers set to: ", state.ethers);
    },
    setProvider(state, provider) {
      state.provider = provider;
      console.log("provider set to: ", state.provider);
    },

    setOnboard(state, onboard) {
      state.onboard = onboard;
      console.log("onboard set to: ");
      console.log(state.onboard);
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
      console.log("wallet set to: ");
      console.log(state.wallet);
    }
  },
  actions: {
    async setUp({ dispatch, state }) {
      console.log("IN SETUP");
      // Setting up Onboard.js
      // await setUpOnboard();
      await dispatch("setUpOnboard");

      // Setting up the Smart contracts
      await dispatch("setUpContracts");
    },

    setUpOnboard({ commit, state }) {
      console.log("Onboard.js flow...");
      const apiKey = process.env.REACT_APP_ONBOARD_API_KEY
        ? process.env.REACT_APP_ONBOARD_API_KEY
        : "12153f55-f29e-4f11-aa07-90f10da5d778";
      const infuraId = process.env.REACT_APP_INFURA_ID || "d5e29c9b9a9d4116a7348113f57770a8";
      const infuraRpc = `https://${state.currentNetwork?.name}.infura.io/v3/${infuraId}`;
      const onboard = await Onboard({
        dappId: apiKey,
        hideBranding: true,
        networkId: 1, // Default to main net. If on a different network will change with the subscription.
        subscriptions: {
          address: address => {
            commit("setUserAddress", address);
          },
          network: async networkId => {
            onboard.config({ networkId: networkId });
          },
          wallet: async (wallet, networkId) => {
            if (wallet.provider) {
              commit("setWallet", wallet);
              const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
              commit("setProvider", ethersProvider);
              // Converts the network ID into human readable label
              let network = await getNetIdString(networkId);
              commit("setCurrentNetwork", network);
              // Gets the signer from the ethersProvider
              let signer = await ethersProvider.getSigner();
              commit("setSigner", signer);
              // Requests the address to connect to from the user
              await state.provider.send("eth_requestAccounts", []);
              const address = await state.signer.getAddress();
              commit("setUserAddress", address);
            } else {
              commit("setProvider", null);
              commit("setCurrentNetwork", null);
              commit("setSigner", null);
              commit("setUserAddress", null);
            }
          }
        },
        walletSelect: {
          wallets: [
            { walletName: "metamask", preferred: true },
            {
              walletName: "imToken",
              rpcUrl:
                !!state.network && state.network.chainId === 1
                  ? "https://mainnet-eth.token.im"
                  : "https://eth-testnet.tokenlon.im",
              preferred: true
            },
            { walletName: "coinbase", preferred: true },
            {
              walletName: "portis",
              apiKey: process.env.REACT_APP_PORTIS_API_KEY
            },
            { walletName: "trust", rpcUrl: infuraRpc },
            { walletName: "dapper" },
            {
              walletName: "walletConnect",
              rpc: { [state.network?.chainId || 1]: infuraRpc }
            },
            { walletName: "walletLink", rpcUrl: infuraRpc },
            { walletName: "opera" },
            { walletName: "operaTouch" },
            { walletName: "torus" },
            { walletName: "status" },
            { walletName: "unilogin" },
            {
              walletName: "ledger",
              rpcUrl: infuraRpc
            }
          ]
        },
        walletCheck: [
          { checkName: "connect" },
          { checkName: "accounts" },
          { checkName: "network" },
          { checkName: "balance", minimumBalance: "0" }
        ]
      });
      await onboard.walletSelect();
      commit(mutations.SET_ONBOARD, onboard);
      await onboard.walletCheck();
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
    }

    // LOADING ACTIONS

    /**
     * @notice Pulls all the posts from the ThreadDB and adds any posts that the
     * state does not currently have.
     */
  },
  modules: {}
});
