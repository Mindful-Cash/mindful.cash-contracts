<template>
  <div class="rowItem gradient-border" @click="rowClicked">
    <div class="md-layout  md-alignment-center-right">
      <div class="md-layout-item md-size-10">
        <img :width="30" :src="asset.logoURI" />
      </div>
      <div class="md-layout-item" style="text-align: left">
        <span class="primaryText">{{ asset.name }} </span>
        <span class="secondaryText">({{ asset.symbol }}) </span>
      </div>
      <div class="md-layout-item" style="text-align: right">
        <span class="secondaryText" style="padding-right: 10px">${{ asset.value }}</span>
        <span class="primaryText" style="padding-right: 10px">{{ asset.amountRounded }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "SelectAssetRowItem",
  components: { VueApexCharts },
  props: {
    asset: {
      type: Object,
      required: true
    }
  },

  computed: {}
};
</script>
<style lang="scss" scoped>
.rowItem {
  padding-bottom: 14px;
  border-bottom: 1px solid #dddddd;
  padding-top: 15px;
  cursor: pointer;
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

.gradient-border:hover {
  background: linear-gradient(74.67deg, rgba(0, 224, 255, 0.075) -6.3%, rgba(170, 85, 255, 0.075) 111.05%) !important;
}
</style>
