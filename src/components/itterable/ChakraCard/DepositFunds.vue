<template>
  <div class="Deposit-modal" style="text-align: left">
    <h1 class="Deposit-strategy-text">Deposit Funds</h1>
    <hr />
    <div class="md-layout">
      <div class="md-layout-item" style="padding-left:30px;padding-right:30px;padding-top:10px;padding-bottom:20px">
        <span class="modal-text-small">
          You are about to Deposit your Chakra strategy. Are you sure you’re in a mindful mood? Not being a degen?
          Alright then, let’s do it...</span
        >
        <Segment
          style="width:600; margin-top:20px"
          :titles="['Single Asset', 'Exact Asset']"
          v-on:update-selected="tabIndex = $event"
        />

        <div v-if="tabIndex == 'Single Asset'">
          <img style="padding-top:30px" src="@/assets/svg/deposit-funds1.svg" />
        </div>

        <div v-if="tabIndex == 'Exact Asset'">
          <img style="padding-top:30px" src="@/assets/svg/deposit-funds1.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Segment from "@/components/elements/Segment";
export default {
  name: "DepositChakra",
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
  data: () => ({ tabIndex: "Single Asset" }),

  computed: {}
};
</script>

<style lang="scss" scoped>
.Deposit-modal {
  width: 640px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
.Deposit-strategy-text {
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
