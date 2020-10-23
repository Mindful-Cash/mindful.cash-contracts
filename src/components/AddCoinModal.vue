<template>
  <div>
    <input placeholder="Enter Name" style="color:black" v-model="filterToken" />
    <br />
    <br />
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
      required: false
    }
  },
  data: () => ({ filterToken: null }),
  methods: {
    handelCoinChosen(coinObject) {
      this.$emit("rowItemClicked", coinObject);
    }
  },
  computed: {
    ...mapState(["allTokens"]),
    allTokensProcessed() {
      if (this.allTokens.length === 0) {
        return [];
      }
      const filterToken = this.filterToken;
      let nameList = this.allTokens;
      if (filterToken) {
        nameList = this.allTokens.filter(token => {
          return (
            token.symbol.toLowerCase().indexOf(filterToken.toLowerCase()) != -1 ||
            token.address.toLowerCase() == filterToken.toLowerCase()
          );
        });
      }
      console.log("nameList", nameList);
      if (!this.filterOnlyWithBalance) {
        return nameList;
      }
      if (this.filterOnlyWithBalance) {
        return nameList.filter(token => {
          return token.value !== 0;
        });
      }
    }
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
</style>
