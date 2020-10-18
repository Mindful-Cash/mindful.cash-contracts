<template>
  <div class="about">
    <div>
      chart
      <div class="main-section" style="padding-top: 20px" v-if="chartInfo">
        <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "Home",
  components: { VueApexCharts },
  props: {
    chartInfo: {
      type: Array,
      required: true,
    },
  },

  computed: {
    options: function () {
      if (!this.chartInfo) return null;
      return {
        chart: {
          id: "vuechart-example",
        },
        xaxis: {
          categories: this.chartInfo.map((x) => x[0]),
        },
      };
    },
    series: function () {
      if (!this.chartInfo) return null;
      return [
        {
          name: "series-1",
          data: this.chartInfo.map((x) => x[1]),
        },
      ];
    },
  },
};
</script>
