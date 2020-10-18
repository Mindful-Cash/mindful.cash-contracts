<template>
  <div class="about">
    <div>
      chart
      <div class="main-section" style="padding-top: 20px" v-if="chartInfo">
        <apexchart width="100%" height="500" type="line" :options="options" :series="series"></apexchart>
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
        colors: ["#2EBAFF"],
        theme: {
          palette: "palette1",
          mode: "light",
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        chart: {
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: this.chartInfo.map((x) => x[0]),
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            gradientToColors: ["#7F78FF"],
            shadeIntensity: 1.0,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
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
