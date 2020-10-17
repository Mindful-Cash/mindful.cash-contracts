<template>
  <div class="text-center">
    <Select-Asset-Row-Item
      v-for="token in allTokens"
      :asset="token"
      @rowClicked="handelCoinChosen"
      :key="token.address"
    ></Select-Asset-Row-Item>
  </div>
</template>

<script>
/* global web3:true */
import { mapActions, mapState } from "vuex";
import SelectAssetRowItem from "@/components/itterable/SelectAssetRowItem";
export default {
  name: "AddCoinModal",
  components: { SelectAssetRowItem },
  methods: {
    handelCoinChosen(coinObject) {
      this.$emit("rowItemClicked", coinObject);
    }
  },
  mounted() {},
  computed: {
    ...mapState(["allTokens"])
  }
};
</script>

<style>
.selectAssets {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  color: #292929;
}

.roundedDialog {
  background: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px !important;
}
</style>
