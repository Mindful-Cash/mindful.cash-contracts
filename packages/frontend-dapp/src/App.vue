<template>
  <md-app :id="this.$router.currentRoute.name != 'Landing' ? 'app' : 'landing'" md-mode="reveal">
    <div
      class="custom-navbar"
      style="text-align: left;padding:20px"
      slot="md-app-toolbar"
      v-if="this.$router.currentRoute.name != 'Landing'"
    >
      <span>
        <img style="cursor: pointer; text-align: left" src="@/assets/svg/logo.svg" alt="logo" @click="goToLanding" />
      </span>
      <div class="md-toolbar-section-end">
        <div class="md-layout md-gutter md-alignment-center-right">
          <!-- <div class="md-layout-item" v-if="!userAddress">
            <md-button class="md-raised md-accent connect-button-secondary" @click="connectWallet"
              >🦊 Connect Wallet</md-button
            >
          </div> -->
          <div class="md-layout-item" v-if="userAddress">
            <div class="md-subheading">
              <clickable-address :light="true" :eth-address="userAddress" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <md-app-content>
      <router-view />
      <div v-if="userAddress">
        <!-- <mining-transaction /> -->
      </div>
      <div
        style="padding-top: 200px; padding-left: 20px; padding-right: 20px; color: #292929;"
        v-if="!userAddress && this.$router.currentRoute.name != 'Landing'"
      >
        <h1>Connect a Web3 wallet to get started</h1>
        <div
          class="md-layout-item"
          v-if="!userAddress"
          style="padding-top: 20px; padding-left: 20px; padding-right: 20px"
        >
          <md-button class="md-raised md-accent connect-button" @click="connectWallet">🦊 Connect Wallet</md-button>
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

export default {
  name: "app",
  components: { ClickableAddress, MiningTransaction },
  data() {
    return {
      menuVisible: false
    };
  },
  methods: {
    ...mapActions(["setUp"]),
    connectWallet() {
      this.setUp();
    },
    goToLanding() {
      router.push({ path: "/landing" });
    }
  },

  computed: {
    ...mapState(["currentNetwork", "userAddress"])
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Inter:400,500,600,700,400italic");
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
      accent: #fff,
    // The secondary color of your brand,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  )
);
@import "~vue-material/dist/theme/all"; // Apply the theme

html {
  font-family: -apple-system, BlinkMacSystemFont, Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
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

#landing {
  text-align: center;
  min-height: 100vh;
  max-width: 2024px;
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

.menu-link {
  margin-top: 50px !important;
  padding: 10px;
  cursor: pointer;
}

.connect-button {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%) !important;
  border-radius: 8px !important;
  width: 199px;
  height: 40px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff !important;
  text-transform: none !important;
}
</style>
