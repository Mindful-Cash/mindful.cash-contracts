<template>
  <div class="text-center">
    <md-button class="md-primary md-raised" @click="showDialog = true">Show Dialog</md-button>

    <md-dialog class="text-center" :md-active.sync="showDialog">
      <md-dialog-title>Select Asset</md-dialog-title>
      <md-dialog-content style="width:750px">
        <Select-Asset-Row-Item v-for="token in allTokens" :asset="token" :key="token.address"></Select-Asset-Row-Item>
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
    showDialog: true
  }),
  methods: {
    ...mapActions(["CLOSE_MINING_DIALOG"]),
    modalClosed() {
      console.log("CLOSED");
      this.CLOSE_MINING_DIALOG();
    }
  },
  mounted() {},
  computed: {
    ...mapState(["allTokens"]),
    allTokensInWallet() {
      return [{ address: 1 }, { address: 2 }];
    }
  }
};
</script>

<style></style>
