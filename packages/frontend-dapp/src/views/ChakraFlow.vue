<template>
  <div class="wrapper">
    <h1 class="title">New Chakra</h1>
    <md-steppers style="width-100%">
      <md-step id="first" md-label="Setup">
        <div class="md-layout gutter">
          <div class="md-layout-item md-size-55">
            <h2 class="title">Chakra Name</h2>
            <p>Choose a name for your Chakra. This will be viewable by other users.</p>
            <input placeholder="Enter Name" v-model="chakraName" />
            <Separator />
            <h2 class="title">Select Distribution</h2>
            <p>Select the tokens you want to add to your Chakra, and choose your distribution ratios.</p>

            <div v-for="(coin, index) in selectedCoins" :key="index" style="padding-top: 20px; padding-bottom: 20px">
              <div class="md-layout">
                <div class="md-layout-item md-size-20 md-layout" style="text-align: left">
                  <div class="md-layout-item" style="text-align: left">
                    <img :width="30" :height="30" :src="coin.logoURI" style="margin-left: 10px" />
                  </div>
                  <div class="md-layout-item" style="padding-top: 5px">
                    <span class="secondaryText"> {{ coin.symbol }}</span>
                  </div>
                </div>
                <div class="md-layout-item" style="padding-top: 5px">
                  <vue-slider
                    v-model="coin.ratio"
                    v-bind="selectorOptions"
                    :dotOptions="{ max: coin.ratio + unselectedPercent }"
                    :max="100"
                    :tooltip="'always'"
                    :process-style="{ backgroundColor: colors[index] }"
                    :tooltip-style="{ backgroundColor: colors[index], borderColor: colors[index] }"
                  ></vue-slider>
                </div>
                <div class="md-layout-item md-size-10">
                  <md-button class="md-icon-button md-raised md-dense" @click="removeCoinFromSelected(index)">
                    <md-icon>remove</md-icon>
                  </md-button>
                </div>
              </div>
            </div>

            <button class="add-asset-btn" @click="showCoinDialog = true"><span>+ Add Asset</span></button>
            <Separator />
            <h2 class="title">Initial Contribution</h2>

            <Segment :titles="['Any Asset', 'Exact Assets']" v-on:update-selected="contributionMode = $event" />

            <p>
              Deposit any asset to fund your Chakra. The assets you deposit will be used to buy the assets in your
              Chakra in accordance with your specified distribution.
            </p>
            <p><b>Slippage may occur during this process.</b></p>
            <p><b>An extra 5% ETH is sent with the TX to avoid unexpected errors - unused ETH will be returned.</b></p>

            <div class="md-layout">
              <div class="md-layout-item md-size-25" style="margin-right: 10px">
                <AssetDropdown
                  :asset="initialContributionCoin"
                  v-on:show-modal="showSelectInitialContributionDialog = true"
                />
              </div>
              <div class="md-layout-item md-size">
                <input placeholder="0" type="number" v-model="initialContribution" />
              </div>
              <div class="md-layout-item md-size-20" style="margin-left: 5px">
                <md-button class="approve-button">Approve</md-button>
              </div>
            </div>

            <div
              class="md-layout md-alignment-center-right"
              style="padding-top: 20px; margin-bottom: 30px; text-align: right"
            >
              <div class="md-layout-item">
                <span class="totalContributionText">Total Contribution:</span
                ><span class="totalContributionNumber">$0.00</span>
              </div>
            </div>

            <div class="md-layout" style="padding-top: 20px; margin-bottom: 30px">
              <div class="md-layout-item md-size-60"></div>
              <div class="md-layout-item">
                <md-button :disabled="true" class="approve-button">Next</md-button>
              </div>
              <div class="md-layout-item">
                <md-button :disabled="true">Cancel</md-button>
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-5" />
          <div class="md-layout-item md-size-40" style="padding-top: 20px">
            <div class="md-layout-item">
              <apexchart
                type="donut"
                width="420"
                :options="pieValues.options"
                :series="pieValues.values"
                class="center"
              />
            </div>
            <div class="md-layout-item" style="text-align: center" v-if="selectedCoins.length > 0">
              <span class="assetBreakdownText">Asset Breakdown</span>
              <md-table class="md-caption" style="padding-top: 25px">
                <md-table-row>
                  <md-table-head>Key</md-table-head>
                  <md-table-head>Symbol</md-table-head>
                  <md-table-head>USD</md-table-head>
                  <md-table-head>Allocation</md-table-head>
                </md-table-row>

                <md-table-row v-for="(item, index) in selectedCoins" :key="index">
                  <md-table-cell>
                    <span class="dot" :style="'background:' + colors[index]" />
                  </md-table-cell>
                  <md-table-cell>{{ item.symbol }}</md-table-cell>
                  <md-table-cell>${{ "500" }}</md-table-cell>
                  <md-table-cell>{{ item.ratio }}%</md-table-cell>
                </md-table-row>
              </md-table>
            </div>
          </div>
        </div>
      </md-step>

      <md-step id="second" md-label="Mindful Strategy">
        <div class="md-layout gutter">
          <!-- DCA strategy -->
          <div class="md-layout-item md-size-55">
            <div class="md-layout md-gutter md-alignment-center-left">
              <div class="md-layout-item">
                <h2 class="title">DCA Strategy</h2>
              </div>
              <div class="md-layout-item" style="display: flex; justify-content: flex-end;">
                <md-switch class="" v-model="array" value="1" />
              </div>
            </div>
            <p>
              Setup a DCA (dollar cost average) strategy to automatically buy into your Chakra according to a set
              schedule and budget.
            </p>
            <p><b>Note that your DCA can be paused, edited, or updated at any time.</b></p>
            <Dropdown
              class="my-dropdown-toggle"
              :options="dcaTimeframes"
              :selected="dcaTimeframes[dcaTimeframes.length - 1]"
              v-on:updateOption="handleFrequencySelect"
              :closeOnOutsideClick="boolean"
            />
            <div class="md-layout" style="padding-top: 20px">
              <div class="md-layout-item md-size-30">
                <AssetDropdown
                  :asset="initialDCAContributionCoin"
                  v-on:show-modal="showSelectInitialDCAContributionDialog = true"
                />
              </div>
              <div class="md-layout-item md-size-50">
                <TokenInput
                  :state="tokenAllowanceState"
                  v-model="tokenAllowance"
                  v-on:approve-token="handleTokenAllowance($event)"
                />
              </div>
              <div class="md-layout-item md-size-20">
                <TokenInfo :price="20" :balance="2" />
              </div>
            </div>
            <Separator />
          </div>
          <div class="md-layout-item md-size-5" />
          <div class="md-layout-item md-size-40">
            <h2 class="title">DCA Strategy Breakdown</h2>
            <div class="md-layout" style="padding-top: 20px">
              <div class="md-layout-item md-size-30">
                <p>Amount:</p>
              </div>
              <div class="md-layout-item md-size-70">
                <p>{{ tokenAllowance || "–" }} {{ dcaBreakdownStats.coin || "" }}</p>
              </div>
            </div>
            <div class="md-layout" style="padding-top: 20px">
              <div class="md-layout-item md-size-30">
                <p>Frequency:</p>
              </div>
              <div class="md-layout-item md-size-70">
                <p>{{ dcaBreakdownStats.frequency || "–" }}</p>
              </div>
            </div>
            <div class="md-layout" style="padding-top: 20px">
              <div class="md-layout-item md-size-30">
                <p>Management Fee:</p>
              </div>
              <div class="md-layout-item md-size-70">
                <p>Gas + 0.3% of DCA</p>
              </div>
            </div>

            <Separator />
          </div>
          <!-- Profit strategy -->
          <div class="md-layout gutter">
            <div class="md-layout-item md-size-55">
              <div class="md-layout md-gutter md-alignment-center-left">
                <div class="md-layout-item">
                  <h2 class="title">Profit Strategy</h2>
                </div>
                <div class="md-layout-item" style="display: flex; justify-content: flex-end;">
                  <md-switch class="" v-model="array" value="1" />
                </div>
              </div>
              <p>
                Sell portions of your Chakra on the way up according to a profit-taking strategy.
                <b>Some fees apply.</b>
              </p>

              <div class="md-layout md-alignment-center-left">
                <div class="md-layout-item md-size-30">
                  <p>Take profit as:</p>
                </div>
                <div class="md-layout-item md-size-70">
                  <Segment :titles="['% of Chakra', '% of Profit']" v-on:update-selected="contributionMode = $event" />
                </div>
              </div>
              <div class="md-layout md-alignment-center-left" style="padding-top: 20px">
                <div class="md-layout-item md-size-30">
                  <p>Take profit after:</p>
                </div>
                <div class="md-layout-item md-size-35">
                  <div class="percentage">
                    <span>%</span>
                    <input placeholder="0" type="number" v-model="initialContribution" style="width: 100%" />
                  </div>
                </div>
                <div class="md-layout-item md-size-35">
                  <p style="margin-left:1rem">increase in Chakra value.</p>
                </div>
              </div>
              <div class="md-layout md-alignment-center-left" style="padding-top: 20px">
                <div class="md-layout-item md-size-30">
                  <p>Profit to take:</p>
                </div>
                <div class="md-layout-item md-size-35">
                  <div class="percentage">
                    <span>%</span>
                    <input placeholder="0" type="number" v-model="initialContribution" style="width: 100%" />
                  </div>
                </div>
                <div class="md-layout-item md-size-35">
                  <p style="margin-left:1rem">of total Chakra value.</p>
                </div>
              </div>
              <div class="md-layout md-alignment-center-left" style="padding-top: 20px">
                <div class="md-layout-item md-size-30">
                  <p>Take profit in:</p>
                </div>
                <div class="md-layout-item md-size-45">
                  <AssetDropdown
                    :asset="initialContributionCoin"
                    v-on:show-modal="showSelectInitialContributionDialog = true"
                  />
                </div>
                <div class="md-layout-item md-size-25">
                  <TokenInfo :price="20" :balance="2" />
                </div>
              </div>
            </div>
            <div class="md-layout-item md-size-5" />
            <div class="md-layout-item md-size-40">
              <h2 class="title">Profit Strategy Breakdown</h2>

              <div class="md-layout" style="padding-top: 20px">
                <div class="md-layout-item md-size-100">
                  <p>When Chakra value increases by -%, take -% of - as profit in -.</p>
                </div>
              </div>
              <div class="md-layout" style="padding-top: 20px">
                <div class="md-layout-item md-size-30">
                  <p>Fees:</p>
                </div>
                <div class="md-layout-item md-size-70">
                  <p>Gas + 0.3% of DCA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </md-step>

      <md-step id="third" md-label="Complete">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
      </md-step>
    </md-steppers>
    <md-dialog class="text-center roundedDialog" :md-active.sync="showCoinDialog">
      <md-dialog-title class="selectAssets" style="text-align: left">Select Asset</md-dialog-title>

      <md-dialog-content style="width: 750px; padding-top: 15px; padding-left: 0px; padding-right: 0px">
        <Add-Coin-Modal @rowItemClicked="handelCoinChosen" />
      </md-dialog-content>
    </md-dialog>

    <md-dialog class="text-center roundedDialog" :md-active.sync="showSelectInitialContributionDialog">
      <md-dialog-title class="selectAssets" style="text-align: left">Select Asset</md-dialog-title>

      <md-dialog-content style="width: 750px; padding-top: 15px; padding-left: 0px; padding-right: 0px">
        <Add-Coin-Modal :filterOnlyWithBalance="true" @rowItemClicked="handelInitialSendCoinChosen" />
      </md-dialog-content>
    </md-dialog>

    <md-dialog class="text-center roundedDialog" :md-active.sync="showSelectInitialDCAContributionDialog">
      <md-dialog-title class="selectAssets" style="text-align: left">Select Asset</md-dialog-title>

      <md-dialog-content style="width: 750px; padding-top: 15px; padding-left: 0px; padding-right: 0px">
        <Add-Coin-Modal :filterOnlyWithBalance="true" @rowItemClicked="handleInitialDCACoinChosen" />
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
import Separator from "@/components/elements/Separator";
import Segment from "@/components/elements/Segment";
import AssetDropdown from "@/components/elements/AssetDropdown";
import TokenInput from "@/components/elements/TokenInput";
import TokenInfo from "@/components/elements/TokenInfo";
import AddCoinModal from "@/components/AddCoinModal";
import Dropdown from "vue-dropdowns";

import { mapActions, mapState } from "vuex";
export default {
  name: "ChakraFlow",
  components: { Separator, AddCoinModal, Segment, AssetDropdown, TokenInput, TokenInfo, Dropdown },
  data: () => ({
    chakraName: null,
    initialContribution: 0,
    initialContributionCoin: { symbol: "SELECT", logoURI: null },
    initialDCAContributionCoin: { symbol: "SELECT", logoURI: null },
    contributionMode: "single",
    showCoinDialog: false,
    showSelectInitialContributionDialog: false,
    showSelectInitialDCAContributionDialog: false,
    selectedCoins: [],
    tokenAllowance: 0,
    tokenAllowanceState: "default",
    // DCA
    dcaTimeframes: [{ name: "Daily" }, { name: "Weekly" }, { name: "Fortnightly" }, { name: "Monthly" }],
    dcaBreakdownStats: {
      amount: null,
      coin: null,
      frequency: null,
      fee: null
    },
    //
    colors: [
      "#A8A2F5",
      "#E66C82",
      "#F8D771",
      "#9BECBE",
      "#4371E0",
      "#CC83E9",
      "#F77D6A",
      "#D5F871",
      "#67E6ED",
      "#7B66F7"
    ]
  }),
  methods: {
    handleFrequencySelect({ name: frequency }) {
      this.dcaBreakdownStats = { ...this.dcaBreakdownStats, frequency };
    },
    handleTokenAllowance(allowance) {
      // alert(allowance);
      // demo
      this.tokenAllowanceState = "loading";
      setTimeout(() => {
        this.tokenAllowanceState = "complete";
      }, 5000);
    },
    handelInitialSendCoinChosen(chosenCoin) {
      console.log("CHOSEN", chosenCoin);
      this.initialContributionCoin = chosenCoin;
      this.showSelectInitialContributionDialog = false;
    },
    handleInitialDCACoinChosen(coin) {
      this.initialDCAContributionCoin = coin;
      this.dcaBreakdownStats = { ...this.dcaBreakdownStats, coin: coin.symbol };
      this.showSelectInitialDCAContributionDialog = false;
    },
    handelCoinChosen(coinObject) {
      console.log("clickedz", coinObject);
      if (
        this.selectedCoins
          .map(itterationToken => {
            return itterationToken.symbol;
          })
          .indexOf(coinObject.symbol) == -1
      ) {
        this.selectedCoins.push({ ...coinObject, ratio: 0 });
      } else {
      }
      this.showCoinDialog = false;
    },
    removeCoinFromSelected(removeIndex) {
      console.log("removing", removeIndex);
      this.selectedCoins[removeIndex].ratio = 0;
      this.selectedCoins.splice(removeIndex, 1);
      this.showCoinDialog = false;
    }
  },

  computed: {
    ...mapState(["allTokens"]),
    totalSelected() {
      let total = 0;
      this.selectedCoins.forEach(function(selected) {
        if (selected.ratio) {
          total += selected.ratio;
        }
      });
      return total;
    },
    selectorOptions() {
      let remaining = 100 - this.totalSelected;
      return {
        process: ([pos, i]) => [
          [0, pos],
          [pos, pos + remaining, { backgroundColor: "#999" }]
        ]
      };
    },
    unselectedPercent() {
      return 100 - this.totalSelected;
    },
    pieValues() {
      let pieValues = [];
      let pieLabels = [];
      let pieColors = [];
      let count = 0;
      let colors = this.colors;
      this.selectedCoins.forEach(function(token) {
        pieValues.push(token.ratio);
        pieLabels.push(token.symbol);
        pieColors.push(colors[count]);
        count++;
      });
      pieValues.push(this.unselectedPercent);
      pieLabels.push("Remaining");
      pieColors.push("#999");
      return {
        values: pieValues,
        options: {
          labels: pieLabels,
          colors: pieColors,
          dataLabels: {
            enabled: true
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  show: false
                }
              }
            }
          ],
          legend: {
            show: false
          }
        }
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

// Navigation overrides
::v-deep .md-steppers-navigation {
  box-shadow: none !important;
  border-bottom: 1px solid rgba(41, 41, 41, 0.1);
}

::v-deep .md-steppers .md-stepper-number {
  background: none !important;
  color: #ccc !important;
  border: 1px solid #ccc !important;
}

::v-deep .md-steppers .md-active .md-stepper-number {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%) !important;
  border: none !important;
  color: #fff !important;
}

::v-deep .md-steppers .md-stepper-text {
  color: #ccc !important;
}

::v-deep .md-steppers .md-active .md-stepper-text {
  color: #292929 !important;
  font-weight: 500 !important;
}

// Switch override
::v-deep .md-switch.md-theme-default .md-switch-container {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  box-shadow: inset 0px 1px 4px rgba(0, 0, 0, 0.25);
}

::v-deep .md-switch.md-theme-default .md-switch-container .md-switch-thumb {
  background: #fff;
}

// Theme
.wrapper {
  text-align: left;
}

::v-deep .md-steppers .md-stepper-content {
  display: flex;
}

input {
  border: none;
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: 0.5rem;
  color: #aaa;
  background: none;
  border-radius: 8px;
  height: 2.5rem;
  box-sizing: border-box;
  width: 95%;
  padding: 0 1rem;
  font-size: 1rem;

  &:focus {
    border: 1px solid #00e0ff;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
}

.percentage {
  position: relative;

  span {
    position: absolute;
    top: 25%;
    right: 0.75rem;
    vertical-align: middle;
    color: #aaa;
  }
}

h1.title {
  margin: 1.5rem 0 0 1.5rem;
}

.subtitle {
  font-size: 1.125rem;
  font-weight: 500;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.875rem;
}

.add-asset-btn {
  height: 2.5rem;
  border: 1px solid #aaa;
  color: #aaa;
  text-align: center;
  width: 95%;
  background: none;
  box-shadow: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;

  span {
    transition: all ease-in-out 0.5s;
    font-size: 1rem;
  }

  &:hover {
    border: 1px solid #00e0ff;

    span {
      background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.roundedDialog {
  background: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px !important;
}

.primaryText {
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #292929;
}

.secondaryText {
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: #aaaaaa;
}

.assetBreakdownText {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
}
.dot {
  vertical-align: middle;
  text-align: center;
  height: 15px;
  width: 15px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
}

.totalContributionText {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: right;
  color: rgba(41, 41, 41, 0.75);
  border: 1px solid #ffffff;
}

.totalContributionNumber {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 26px;
  line-height: 31px;
  text-align: right;
  color: #292929;
  border: 1px solid #ffffff;
}

.my-dropdown-toggle {
  width: 100%;
  text-align: center;
  font-size: 1rem;

  ::v-deep .dropdown-toggle {
    color: #fff;
    border-radius: 0.5rem;
    background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
    font-weight: 600;
  }

  ::v-deep .dropdown-menu {
    width: 100%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05) !important;
    border-radius: 0.5rem;
    background: #fff;
    padding: 0;
  }

  ::v-deep .dropdown-menu li {
    border-bottom: 1px solid #ddd;
    text-align: center;
    color: #292929;
    font-size: 1rem;

    a:hover {
      background: linear-gradient(74.67deg, rgba(0, 224, 255, 0.075) -6.3%, rgba(170, 85, 255, 0.075) 111.05%);
      text-decoration: none;
    }
  }
}
</style>
