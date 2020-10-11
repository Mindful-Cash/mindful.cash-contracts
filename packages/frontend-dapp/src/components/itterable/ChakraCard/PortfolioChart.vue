<template>
  <div class="about">
    <div>
      chart
      {{ chartData }}
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
      return {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: chartData.map(x => x[0])
        }
      };
    },
    series: function() {
      return [
        {
          name: "series-1",
          data: chartData.map(x => x[1])
        }
      ];
    }
  }
};
</script>
