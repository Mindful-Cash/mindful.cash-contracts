<template>
  <div class="text-center roundedDialog">
    <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>

    <md-dialog class="text-center roundedDialog" :md-active.sync="showDialog">
      <md-dialog-title class="selectAssets" style="text-align: left">Select Asset</md-dialog-title>

      <md-dialog-content style="width:750px;padding-top:15px;padding-left:0px;padding-right:0px;">
        <Select-Asset-Row-Item
          v-for="token in allTokens"
          :asset="token"
          @rowClicked="handelCoinChosen"
          :key="token.address"
        ></Select-Asset-Row-Item>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
/* global web3:true */
import { mapActions, mapState } from "vuex";
import SelectAssetRowItem from "@/components/itterable/SelectAssetRowItem";
export default {
  name: "AddCoinModal",
  components: { SelectAssetRowItem },
  data: () => ({
    showDialog: false
  }),
  methods: {
    handelCoinChosen(address) {
      console.log("clicked", address);
      this.showDialog = false;
      this.$emit("rowItemClicked", address);
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
