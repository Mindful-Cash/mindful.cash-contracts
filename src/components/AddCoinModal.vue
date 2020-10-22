<template>
  <div class="text-center">
    <Select-Asset-Row-Item
      v-for="token in allTokensProcessed"
      :asset="token"
      @rowClicked="handelCoinChosen"
      :key="token.address"
    ></Select-Asset-Row-Item>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SelectAssetRowItem from "@/components/itterable/SelectAssetRowItem";
export default {
  name: "AddCoinModal",
  components: { SelectAssetRowItem },
  props: {
    filterOnlyWithBalance: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    handelCoinChosen(coinObject) {
      this.$emit("rowItemClicked", coinObject);
    },
  },
  mounted() {},
  computed: {
    ...mapState(["allTokens"]),
    allTokensProcessed() {
      if (this.allTokens.length == 0) {
        return [];
      }
      if (!this.filterOnlyWithBalance) {
        return this.allTokens;
      }
      if (this.filterOnlyWithBalance) {
        return this.allTokens.filter((token) => {
          return token.value != 0;
        });
      }
    },
  },
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
