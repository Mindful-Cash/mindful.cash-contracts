<template>
  <md-app id="app" md-mode="reveal" style="min-height: 100vh;">
    {{ monitorState }}
    <md-app-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
        <md-icon>menu</md-icon>
      </md-button>
      <span
        ><h1>{{ $route.name }}</h1></span
      >

      <!-- <logo style="margin-left:600px"/> -->

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
    </md-app-toolbar>

    <md-app-drawer :md-active.sync="menuVisible">
      <md-list>
        <md-list-item>
          <md-icon>home</md-icon>
          <span class="md-list-item-text">
            <router-link to="/">Home</router-link>
          </span>
        </md-list-item>
        <md-list-item>
          <md-icon>account_box</md-icon>
          <span class="md-list-item-text">
            <router-link to="/CreateProfile">Profile</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>search</md-icon>
          <span class="md-list-item-text">
            <router-link to="/BrowsePosts">Browse Posts</router-link>
          </span>
        </md-list-item>

        <md-divider></md-divider>

        <md-list-item>
          <md-icon>create</md-icon>
          <span class="md-list-item-text">
            <router-link to="/ListPost">Create New Post</router-link>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>format_list_bulleted</md-icon>
          <span class="md-list-item-text">
            <router-link to="/ManagePosts">Manage Posts</router-link>
          </span>
        </md-list-item>

        <md-divider></md-divider>

        <md-list-item>
          <md-icon>code</md-icon>
          <span class="md-list-item-text">
            <a href="https://github.com/Nicca42/News_Buff_V0.1" target="__blank">Github</a>
          </span>
        </md-list-item>

        <md-list-item>
          <md-icon>chat</md-icon>
          <span class="md-list-item-text">
            <a href="https://github.com/Nicca42/News_Buff_V0.1/blob/trunk/README.md" target="__blank">Documentation</a>
          </span>
        </md-list-item>
        <md-divider></md-divider>
      </md-list>
    </md-app-drawer>

    <md-app-content style="background-color: #f5f9f9; padding-left: 0px; padding-right: 0px;">
      <div v-if="userAddress">
        <!-- <mining-transaction /> -->
        <router-view />
        <div class="phone-viewport">
          <md-bottom-bar style="padding-left: 600px; padding-right: 250px;">
            <span>
              The future of mindful money with ❤️ by
              <a href="https://github.com/Nicca42/News_Buff_V0.1" target="_blank">News Buff</a>
              📰
            </span>
          </md-bottom-bar>
        </div>
      </div>
      <div style="padding-top: 20px; padding-left: 20px; padding-right: 20px;" v-if="!userAddress">
        <h1>
          Please connect your wallet
        </h1>
        <div
          class="md-layout-item"
          v-if="!userAddress"
          style="padding-top: 20px; padding-left: 20px; padding-right: 20px;"
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
    ...mapState(["currentNetwork", "userAddress"]),
    monitorState() {
      if (this.userNeedsAccount) {
        router.push({ path: "/CreateProfile" });
        return "routing...";
      }
      return null;
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Space+Mono");
@import url("https://fonts.googleapis.com/css?family=Coiny|Rubik");
@import url("https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap");
// @import "/styles/variables.scss";
@import "~vue-material/dist/theme/engine"; // Import the theme engine
@include md-register-theme(
  "default",
  (
    primary: #000023,
    // The primary color of your brand
      accent: #fc6161 // The secondary color of your brand,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  )
);
@import "~vue-material/dist/theme/all"; // Apply the theme

html,
h1 {
  font-family: "Permanent Marker", cursive;
}

body {
  font-family: "Space Mono", sans-serif;
}

#app {
  text-align: center;
  color: #454a50;
}

#app {
  font-family: "Space Mono", sans-serif;
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
</style>
