<template>
  <md-card style="padding-top: 30px">
    <div class="md-layout" v-if="chartInfo" style="padding-left: 30px;padding-right: 30px">
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
            <md-button class="md-raised md-dense edit-button" @click="editStrategy = true">Edit Strategy</md-button>
          </div>
          <div class="md-layout-item">
            <md-button class="md-raised md-dense pause-button" @click="pauseStrategy = true">Pause DCA</md-button>
          </div>
        </div>
      </div>
    </div>
    <!-- {{ dcaToken }} -->

    <div class="md-layout" style="text-align: left;padding-left:30px;padding-top:20px">
      <div class="md-layout-item">
        <!-- <md-button :class="tabIndex == 0 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 0"> -->
        <img
          @click="tabIndex = 0"
          class="chakra-button-active"
          v-if="tabIndex == 0"
          src="@/assets/svg/tab/my-chakras-active.svg"
        />
        <img
          @click="tabIndex = 0"
          class="chakra-button-inactive"
          v-if="tabIndex != 0"
          src="@/assets/svg/tab/my-chakras-inactive.svg"
        />

        <img
          @click="tabIndex = 1"
          class="chakra-button-active"
          v-if="tabIndex == 1"
          src="@/assets/svg/tab/asset-breakdown-active.svg"
        />
        <img
          @click="tabIndex = 1"
          class="chakra-button-inactive"
          v-if="tabIndex != 1"
          src="@/assets/svg/tab/asset-breakdown-inactive.svg"
        />

        <img
          @click="tabIndex = 2"
          class="chakra-button-active"
          v-if="tabIndex == 2"
          src="@/assets/svg/tab/history-active.svg"
        />
        <img
          @click="tabIndex = 2"
          class="chakra-button-inactive"
          v-if="tabIndex != 2"
          src="@/assets/svg/tab/history-inactive.svg"
        />
      </div>
    </div>
    <hr />

    <Portfolio-Chart :chartInfo="chartInfo" style="padding-top: 10px" v-if="tabIndex == 0" />
    <Asset-Breakdown :Assets="coinsInfo" style="padding-top: 10px" v-if="tabIndex == 1" />
    <Trade-History :HistoryInfo="coinsInfo" style="padding-top: 10px" v-if="tabIndex == 2" />
    <div class="md-layout">
      <div class="md-layout-item md-size-50 fomo-in-button" @click="fomoIn = true">
        <span class="fomo-button-text">Fomo In</span>
      </div>
      <div class="md-layout-item md-size-50 md-size-50 fomo-out-button" @click="fomoOut = true">
        <span class="fomo-button-text">Fomo Out</span>
      </div>
    </div>

    <md-dialog class="text-center roundedDialog" :md-active.sync="editStrategy">
      <Edit-Strategy :chakraInfo="chakraInfo" />
    </md-dialog>

    <md-dialog class="text-center roundedDialog" :md-active.sync="pauseStrategy">
      <Pause-Strategy :chakraInfo="chakraInfo" />
    </md-dialog>

    <md-dialog class="text-center roundedDialog" :md-active.sync="fomoIn">
      <Deposit-Funds :chakraInfo="chakraInfo" />
    </md-dialog>

    <md-dialog class="text-center roundedDialog" :md-active.sync="fomoOut">
      <Withdraw-Funds :chakraInfo="chakraInfo" />
    </md-dialog>
  </md-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

import PortfolioChart from "./PortfolioChart";
import AssetBreakdown from "./AssetBreakdown";
import TradeHistory from "./TradeHistory";

import DepositFunds from "./DepositFunds";
import WithdrawFunds from "./WithdrawFunds";

import EditStrategy from "./EditStrategy";
import PauseStrategy from "./PauseStrategy";
import ChakraCoins from "@/components/elements/ChakraCoins";

export default {
  name: "ChakraCard",
  components: {
    PortfolioChart,
    ChakraCoins,
    AssetBreakdown,
    EditStrategy,
    PauseStrategy,
    TradeHistory,
    DepositFunds,
    WithdrawFunds
  },
  data: () => ({
    fomoIn: false,
    offer: 0,
    tabIndex: 0,
    editStrategy: false,
    pauseStrategy: false,
    fomoIn: false,
    fomoOut: false
  }),
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
  width: 175px;
  text-transform: none;
  margin-bottom: 0px !important;
  border-radius: 0 !important;
}

.selected-tab {
  border-bottom: none;
  width: 175px;
  color: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%) !important;
  // color: #27c8d2 !important;
  text-transform: none;
  font-weight: 800 !important;
  font-family: Inter;
  font-style: normal;
  font-size: 16px !important;
  line-height: 17px;
  transition: all ease-in-out 0.5s;
  margin-bottom: 0px !important;
  border-radius: 0 !important;
}
.selected-tab:after {
  content: "";
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  display: block;
  height: 3px;
  width: 175px;
  position: absolute;
  bottom: 0;
  transition: all ease-in-out 0.5s;
  margin-bottom: 0px !important;
  border-radius: 0 !important;
}

hr {
  border: 1px solid rgba(41, 41, 41, 0.1);
  margin-top: 0px;
}
.roundedDialog {
  background: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px !important;
}

.fomo-in-button {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  border-radius: 0px 0px 0px 12px;
  width: 100%;
  height: 50px;
  color: #ffffff !important;
  padding-top: 15px;
  cursor: pointer;
}

.fomo-out-button {
  background: linear-gradient(45deg, #f67c4b 0%, #e42028 100%);
  border-radius: 0px 0px 12px 0px;
  height: 50px;
  color: #ffffff !important;
  padding-top: 15px;
  cursor: pointer;
}

.fomo-button-text {
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  color: #ffffff;
}

.chakra-button-inactive {
  cursor: pointer;
  padding-bottom: 15px !important;
  padding-left: 10px;
  padding-right: 10px;
}

.chakra-button-active {
  cursor: pointer;
}
</style>
