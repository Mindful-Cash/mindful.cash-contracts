<template>
  <div class="about">
    <div>
      <div class="md-layout">
        <div class="md-layout-item">
          <md-button @click="zoomChart(24)">1D</md-button>
          <md-button @click="zoomChart(24 * 7)">1W</md-button>
          <md-button @click="zoomChart(24 * 30)">1M</md-button>
          <md-button @click="zoomChart(24 * 30 * 3)">3M</md-button>
        </div>
      </div>
      <div class="main-section" style="padding-top: 0px" v-if="chartInfo">
        <apexchart
          width="100%"
          id="portfolioChart"
          height="500"
          type="line"
          :options="options"
          :series="series"
        ></apexchart>
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
  methods: {
    zoomChart(hoursInPast) {
      this.minTimeStamp = new Date().getTime() - hoursInPast * 60 * 60 * 1000;
    },
  },
  data: () => ({
    slicedData: [],
    minTimeStamp: new Date().getTime() - 1000 * 60 * 60 * 24 * 30, // start the chart 30 days in the past
  }),

  computed: {
    options: function () {
      const sliceIndex = this.chartInfo
        .map((x) => x[0])
        .findIndex((num) => {
          return num > this.minTimeStamp;
        });
      const slicedChartArray = this.chartInfo.slice(sliceIndex - 1, this.chartInfo.length.length);
      this.slicedData = slicedChartArray;
      const slicedPrices = slicedChartArray.map((x) => x[1]);
      const priceMin = Math.min(...slicedPrices);
      const priceMax = Math.max(...slicedPrices);
      if (!this.chartInfo) return null;
      return {
        colors: ["#2EBAFF"],
        zoom: {
          autoScaleYaxis: true,
        },
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
          zoom: {
            enabled: true,
          },
        },

        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {
          tickPlacement: "on",
          type: "datetime",
          min: this.minTimeStamp,
          tickAmount: 6,
        },
        yaxis: {
          tickPlacement: "on",
          min: priceMin * 0.95,
          max: priceMax * 1.05,
          tickAmount: 15,
        },
        tooltip: {
          x: {
            format: "hh:mm dd MMM yyyy",
          },
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
      if (!this.chartInfo || !this.slicedData) return null;
      return [
        {
          name: "Chakra Value",
          data: this.slicedData,
          zoom: {
            autoScaleYaxis: true,
          },
        },
      ];
    },
  },
};
</script>
