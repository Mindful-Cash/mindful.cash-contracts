<template>
  <div class="edit-modal" style="text-align: left">
    <h1 class="edit-strategy-text">Edit Strategy</h1>
    <hr />
    <div class="md-layout">
      <div class="md-layout-item" style="padding-left:30px;padding-right:30px;padding-top:10px;padding-bottom:20px">
        <span class="modal-text-small">
          You are about to edit your Chakra strategy. Are you sure you’re in a mindful mood? Not being a degen? Alright
          then, let’s do it...</span
        >
        <Segment
          style="width:600; margin-top:20px"
          :titles="['DCA Strategy', 'Profit Strategy']"
          v-on:update-selected="tabIndex = $event"
        />

        <div v-if="tabIndex == 'DCA Strategy'">
          <img style="padding-top:30px" src="@/assets/svg/edit-stratergy.svg" />
        </div>

        <div v-if="tabIndex == 'Profit Strategy'">
          <img style="padding-top:30px" src="@/assets/svg/profit-strategy.svg" />
        </div>
        <!-- <div v-if="tabIndex == 'DCA Strategy'">
          <span class="secondary-heading">DCA Contribution</span>
          <span class="modal-text-small">
            Choose an asset, amount and frequency to DCA (dollar cost average) into your Chakra.</span
          >
          <span class="secondary-heading">DCA Limit</span>
          <span class="modal-text-small">
            Specify a limit for how much you are willing to DCA over time.
          </span>
          <span class="secondary-heading">DCA Breakdown</span>
        </div> -->
      </div>
    </div>
    <!-- <div class="md-layout-item"> -->
    <!-- </div> -->
  </div>
</template>

<script>
import Segment from "@/components/elements/Segment";
export default {
  name: "EditChakra",
  components: { Segment },
  props: {
    chakraInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDataString(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  computed: {},
  data: () => ({ tabIndex: "DCA Strategy" }),

  computed: {}
};
</script>

<style lang="scss" scoped>
.edit-modal {
  width: 640px;
  height: 740px;
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
