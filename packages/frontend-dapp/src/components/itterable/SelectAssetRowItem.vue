<template>
  <div class="about">
    <div>Asset in wallet :{{ asset }}</div>
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
