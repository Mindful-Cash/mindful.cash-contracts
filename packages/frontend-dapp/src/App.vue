<template>
  <md-app id="app" md-mode="reveal">
    <custom-navbar slot="md-app-toolbar">
      <span>
        <img src="@/assets/svg/logo.svg" alt="logo" />
      </span>
      <div class="md-toolbar-section-end">
        <div class="md-layout md-gutter md-alignment-center-right">
          <div class="md-layout-item" v-if="!userAddress">
            <md-button class="md-raised md-accent" @click="connectWallet">🦊Connect</md-button>
          </div>
          <div class="md-layout-item" v-if="userAddress">
            <div class="md-subheading">
              <clickable-address :light="true" :eth-address="userAddress" />
            </div>
          </div>
        </div>
      </div>
    </custom-navbar>

    <md-app-content>
      <div v-if="userAddress">
        <!-- <mining-transaction /> -->
        <router-view />
        <div class="phone-viewport">
          <md-bottom-bar style="background: none">
            <span style="text-align: center; width: 100%">
              The future of mindful money with ❤️ by
              <a href="https://github.com/Nicca42/News_Buff_V0.1" target="_blank">News Buff</a>
              📰
            </span>
          </md-bottom-bar>
        </div>
      </div>
      <div style="padding-top: 20px; padding-left: 20px; padding-right: 20px" v-if="!userAddress">
        <h1>Please connect your wallet</h1>
        <div
          class="md-layout-item"
          v-if="!userAddress"
          style="padding-top: 20px; padding-left: 20px; padding-right: 20px"
        >
          <md-button class="md-raised md-accent" @click="connectWallet">🦊Connect</md-button>
        </div>
      </div>
    </md-app-content>
  </md-app>
</template>

<script>
import MiningTransaction from "@/components/widgets/MiningTransaction";
import ClickableAddress from "@/components/widgets/ClickableAddress";

import { mapActions, mapState } from "vuex";
import router from "@/router";
import ethers from "ethers";

export default {
  name: "app",
  components: { ClickableAddress, MiningTransaction },
  data() {
    return {
      ethers: null,
      provider: null,
      signer: null,
      menuVisible: false
    };
  },
  methods: {
    ...mapActions(["setUp"]),
    connectWallet() {
      this.setUp();
    }
  },

  computed: {
    ...mapState(["currentNetwork", "userAddress"])
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Space+Mono");
@import url("https://fonts.googleapis.com/css?family=Coiny|Rubik");
@import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
@import "@/styles/variables.scss";
@import "~vue-material/dist/theme/engine"; // Import the theme engine
@include md-register-theme(
  "default",
  (
    primary: #000023,
    // The primary color of your brand
      accent: #fc6161 // The secondary color of your brand,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  )
);
@import "~vue-material/dist/theme/all"; // Apply the theme

html {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: red;
  font-size: 16px;
}

body {
  background: linear-gradient(180deg, #f5feff 0%, #f8f5ff 100%);
}

custom-navbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1.5rem 0;
  box-sizing: border-box;
}

#app {
  text-align: center;
  min-height: 100vh;
  max-width: 1024px;
  margin: 0px auto;
  background: none;
  overflow: visible !important;
}

.md-app-container {
  overflow: visible !important;
}

.md-content {
  padding: 0 !important;
  background: none !important;
  border: none !important;
}

.md-toolbar {
  min-height: 100px !important;
}

.phone-viewport {
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
}

nav li:hover,
nav li.router-link-active,
nav li.router-link-exact-active {
  background-color: indianred;
  cursor: pointer;
}

.text-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.md-theme-default a {
  color: $darkgray;
}
</style>
