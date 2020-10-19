<template>
  <md-card style="padding: 30px">
    <div class="md-layout" v-if="chartInfo">
      <div class="md-layout-item">
        <!-- <span class="chakra-name-text"> {{ chakraInfo.metaData.nameOfBPT }}</span> -->
        <span class="chakra-name-text"> Big DeFi Energy</span>
      </div>
      <div class="md-layout-item">
        <Chakra-Coins :underlyingTokens="coinsInfo" :dcaToken="dcaToken" />
      </div>
      <div class="md-layout-item md-size-30" style="text-align: center">
        <div class="md-layout">
          <div class="md-layout-item md-size"></div>
          <div class="md-layout-item">
            <md-button class="md-raised md-dense edit-button">Edit Strategy</md-button>
          </div>
          <div class="md-layout-item">
            <md-button class="md-raised md-dense pause-button">Pause DCA</md-button>
          </div>
        </div>
      </div>
    </div>
    <!-- {{ dcaToken }} -->

    <div class="md-layout" style="text-align: left">
      <div class="md-layout-item">
        <md-button :class="tabIndex == 0 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 0"
          >Overview</md-button
        >
        <md-button :class="tabIndex == 1 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 1"
          >Asset Breakdown</md-button
        >
        <md-button :class="tabIndex == 2 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 2"
          >History</md-button
        >
      </div>
    </div>

    <Portfolio-Chart :chartInfo="chartInfo" style="padding-top: 10px" v-if="tabIndex == 0" />
  </md-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

import PortfolioChart from "./PortfolioChart";
import ChakraCoins from "@/components/elements/ChakraCoins";

export default {
  name: "ChakraCard",
  components: { PortfolioChart, ChakraCoins },
  data: () => ({ fomoIn: false, offer: 0, tabIndex: 0 }),
  props: {
    chakraInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    pageUrl() {
      // return window.location.href;
    },
    chartInfo() {
      if (this.chakraInfo.chartInfo) {
        return this.chakraInfo.chartInfo;
      } else return null;
    },
    coinsInfo() {
      if (this.chakraInfo.underlyingTokens) {
        return this.chakraInfo.underlyingTokens;
      } else return null;
    },
    dcaToken() {
      if (this.chakraInfo.dcaStratergies) {
        return this.chakraInfo.dcaStratergies[0].token;
      } else return null;
    }
  },
  methods: {
    ...mapActions(["X"])
  }
};
</script>

<style lang="scss" scoped>
.card-expansion {
  height: 480px;
}
.md-card {
  width: 1000px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.box-text {
  text-align: justify;
  text-justify: inter-word;
}

// Link styling
.a:link {
  color: #af0404;
  text-decoration: none;
}

/* visited link */
.a:visited {
  color: #fc6161;
  text-decoration: underline;
}

/* mouse over link */
.a:hover {
  color: #fc6161;
}

/* selected link */
.a:active {
  color: #fc6161;
  text-decoration: underline;
}

.md-dialog {
  max-width: 768px;
}

.chakra-name-text {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  color: #292929;
}

.edit-button {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  border-radius: 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff !important;
  text-transform: none;
}

.pause-button {
  background: linear-gradient(45deg, #f67c4b 0%, #e42028 100%);
  border-radius: 8px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 17px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff !important;
  text-transform: none;
}

.not-selected-tab {
  width: 150px;
  text-transform: none;
}
md-tab {
  background-color: red;
}

.selected-tab {
  border-bottom: none;
  width: 150px;
  color: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%) !important;
  color: #27c8d2 !important;
  text-transform: none;
  font-weight: 800 !important;
  font-family: Inter;
  font-style: normal;
  font-size: 16px !important;
  line-height: 17px;
  transition: all ease-in-out 0.5s;
}
.selected-tab:after {
  content: "";
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  display: block;
  height: 3px;
  width: 150px;
  position: absolute;
  bottom: 0;
  transition: all ease-in-out 0.5s;
}
</style>
