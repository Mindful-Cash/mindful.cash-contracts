<template>
  <div class="about">
    <div>
      <img :width="25" :src="asset.logoURI" />
      {{ asset.name }}({{ asset.symbol }}) {{ asset.usd }}{{ asset.amount }}
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
