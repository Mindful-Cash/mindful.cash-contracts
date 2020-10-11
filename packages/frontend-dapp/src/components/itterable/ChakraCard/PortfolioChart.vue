<template>
  <div class="about">
    <div>
      chart
      <div class="main-section" style="padding-top: 20px" v-if="chartData">
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
    chartData: {
      type: Array,
      required: true
    }
  },

  computed: {
    options: function() {
      if (!this.chartData) return null;
      return {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: this.chartData.map(x => x[0])
        }
      };
    },
    series: function() {
      if (!this.chartData) return null;
      return [
        {
          name: "series-1",
          data: this.chartData.map(x => x[1])
        }
      ];
    }
  }
};
</script>
