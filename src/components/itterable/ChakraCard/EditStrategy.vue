<template>
  <div class="edit-modal" style="text-align: left">
    <h1 class="edit-strategy-text">Edit Strategy</h1>
    <hr />
    <div class="md-layout">
      <div class="md-layout-item" style="padding-left:30px;padding-right:30px;padding-top:10px;padding-bottom:20px">
        <span class="modal-text-small"> Edit or disable your DCA strategy. Are you sure you’re in a mindful mood?</span>
        <Segment
          style="width:600; margin-top:20px"
          :titles="['DCA Strategy', 'Profit Strategy']"
          v-on:update-selected="tabIndex = $event"
        />

        <div v-if="tabIndex == 'DCA Strategy'">
          <div class="secondary-heading md-layout md-gutter md-alignment-center-left">
            <div class="md-layout-item">
              <span>DCA Contribution</span>
            </div>
            <div class="md-layout-item" style="display: flex; justify-content: flex-end;">
              <md-switch class="" v-model="dcaOn" value="1" />
            </div>
          </div>
          <span class="modal-text-small">
            Choose an asset, amount and frequency to DCA (dollar cost average) into your Chakra.</span
          >
          <!-- DCA Dropdown -->
          <Dropdown
            class="my-dropdown-toggle"
            :options="dcaTimeframes"
            :selected="dcaTimeframes[dcaTimeframes.length - 1]"
            v-on:updateOption="handleFrequencySelect"
          />
          <!-- Asset Input -->
          <div class="md-layout" style="padding-top: 20px">
            <div class="md-layout-item md-size-30">
              <AssetDropdown :asset="initialDCAContributionCoin" />
              <!-- v-on:show-modal="showSelectInitialDCAContributionDialog = true" -->
            </div>
            <div class="md-layout-item md-size-40">
              <TokenInput :state="tokenAllowanceState" v-model="tokenAllowance" />
              <!-- v-on:approve-token="handleTokenAllowance($event)" -->
            </div>
            <div class="md-layout-item md-size-30">
              <TokenInfo
                :price="initialDCAContributionCoin.price | 0"
                :balance="initialDCAContributionCoin.amountRounded | 0"
              />
            </div>
          </div>
        </div>

        <div v-if="tabIndex == 'Profit Strategy'">
          <p>hello2</p>
        </div>

        <div class="md-layout" style="padding-top: 20px">
          <div class="md-layout-item md-size-100">
            <hr style="margin:0" />
            <div class="md-layout">
              <div class="md-layout-item md-size-100 stepper-nav">
                <md-button class="cancel-button">Cancel</md-button>
                <md-button class="md-raised md-primary next-button">No Changes</md-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "vue-dropdowns";
import Segment from "@/components/elements/Segment";
import AssetDropdown from "@/components/elements/AssetDropdown";
import TokenInput from "@/components/elements/TokenInput";
import TokenInfo from "@/components/elements/TokenInfo";

export default {
  name: "EditChakra",
  components: {
    Segment,
    Dropdown,
    AssetDropdown,
    TokenInput,
    TokenInfo
  },
  props: {
    chakraInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDataString(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    handleFrequencySelect({ name: frequency }) {
      this.dcaBreakdownStats = { ...this.dcaBreakdownStats, frequency };
    }
  },
  computed: {},
  data: () => ({
    tabIndex: "DCA Strategy",
    dcaTimeframes: [{ name: "Daily" }, { name: "Weekly" }, { name: "Fortnightly" }, { name: "Monthly" }],
    initialDCAContributionCoin: { symbol: "SELECT", logoURI: null },
    tokenAllowance: 0,
    tokenAllowanceState: "default"
  }),
  computed: {}
};
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";

.edit-modal {
  width: 640px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
.edit-strategy-text {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  align-items: center;
  color: #292929;
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 5px;
}
.modal-text-small {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #292929;
  padding-top: 10px;
  display: flex;
}

.secondary-heading {
  font-family: Helvetica Neue;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  color: #292929;
  padding-top: 30px;
}
</style>
