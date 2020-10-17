<template>
  <div class="wrapper">
    <h1 class="title">New Chakra</h1>
    <md-steppers>
      <md-step id="first" md-label="Setup">
        <div class="left">
          <h2 class="title">Chakra Name</h2>
          <p>Choose a name for your Chakra. This will be viewable by other users.</p>
          <input placeholder="Enter Name" v-model="initial" />
          <Separator />
          <h2 class="title">Select Distribution</h2>
          <p>Select the tokens you want to add to your Chakra, and choose your distribution ratios.</p>

          <div v-for="coin in selectedCoins" :key="coin.address">{{ coin }}</div>
          <div v-for="(coin, index) in selectedCoins" :key="index" style="padding-top: 20px">
            <div class="md-layout md-gutter md-alignment-center-center">
              <div class="md-layout-item md-size-15 md-layout">
                <div class="md-layout-item">
                  <img :width="30" :src="coin.logoURI" />
                </div>
                <div class="md-layout-item">
                  <span class="secondaryText">({{ coin.symbol }}) </span>
                </div>
              </div>
              <div class="md-layout-item">
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
                <md-button class="md-icon-button md-raised md-accent" @click="removeCoinFromSelected(index)">
                  <md-icon>remove</md-icon>
                </md-button>
              </div>
            </div>
          </div>

          <button class="add-asset-btn" @click="showCoinDialog = true"><span>+ Add Asset</span></button>
          <Separator />
          <h2 class="title">Initial Contribution</h2>
          <button>replace me</button><button>with switch</button>
          <p>
            Deposit any asset to fund your Chakra. The assets you deposit will be used to buy the assets in your Chakra
            in accordance with your specified distribution.
          </p>
          <p><b>Slippage may occur during this process.</b></p>
          <p><b>An extra 5% ETH is sent with the TX to avoid unexpected errors - unused ETH will be returned.</b></p>
          <button>replace me</button>
        </div>

        <div class="right"></div>
      </md-step>

      <md-step id="second" md-label="DCA Strategy">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias doloribus eveniet quaerat modi cumque quos
          sed, temporibus nemo eius amet aliquid, illo minus blanditiis tempore, dolores voluptas dolore placeat nulla.
        </p>
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
  </div>
</template>

<script>
import Separator from "@/components/elements/Separator";
import AddCoinModal from "@/components/AddCoinModal";
export default {
  name: "ChakraFlow",
  components: { Separator, AddCoinModal },
  data: () => ({
    initial: null,
    showCoinDialog: false,
    selectedCoins: [],
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
      "#7B66F7",
    ],
  }),
  methods: {
    handelCoinChosen(coinObject) {
      console.log("clickedz", coinObject);
      if (
        this.selectedCoins
          .map((itterationToken) => {
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
    },
  },

  computed: {
    totalSelected() {
      let total = 0;
      this.selectedCoins.forEach(function (selected) {
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
          [pos, pos + remaining, { backgroundColor: "#999" }],
        ],
      };
    },
    unselectedPercent() {
      return 100 - this.totalSelected;
    },
  },
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

// Theme
.wrapper {
  text-align: left;
}

::v-deep .md-steppers .md-stepper-content {
  display: flex;
}

.left {
  flex: 3;
}

.right {
  flex: 2;
}

input {
  border: 1px solid #aaa;
  box-shadow: none;
  border-radius: 0.5rem;
  color: #aaa;
  background: none;
  border-radius: 8px;
  height: 2.5rem;
  box-sizing: border-box;
  width: 100%;
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

h1.title {
  margin: 1.5rem 0 0 1.5rem;
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
  width: 100%;
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
</style>
