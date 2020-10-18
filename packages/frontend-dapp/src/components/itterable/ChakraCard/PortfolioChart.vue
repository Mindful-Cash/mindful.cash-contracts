<template>
  <div class="about">
    
      <div class="md-layout" style="text-align: right">
        <div class="md-layout-item" />
        <div class="md-layout-item" />
          <div class="date-selector"  style="text-align: center">
            <span @click="zoomChart(24)" :class="hoursInPast == 24 ? 'date-notselected' : 'date-selected'">1D</span>
            <span @click="zoomChart(24 * 7)" :class="hoursInPast == 24*7 ? 'date-notselected' : 'date-selected'">1W</span>
            <span @click="zoomChart(24 * 30)" :class="hoursInPast == 24 * 30 ? 'date-notselected' : 'date-selected'">1M</span>
            <span @click="zoomChart(24 * 30 * 3)" :class="hoursInPast == 24 * 30 * 3 ? 'date-notselected' : 'date-selected'">3M</span>
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
      this.hoursInPast = hoursInPast
      this.minTimeStamp = new Date().getTime() - hoursInPast * 60 * 60 * 1000;
    },
  },
  data: () => ({
    slicedData: [],
    hoursInPast:24,
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

<style lang="scss" scoped>
.date-selector {
  padding-bottom: 7px;
  padding-top: 7px;
  width: 150px;
  background: #ffffff;
  border: 1px solid rgba(41, 41, 41, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
}

.date-selected {
  padding-left: 5px;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #27c8d2;
  cursor: pointer;
}
.date-notselected {
  padding-left: 5px;
  padding-right: 5px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #000000;
  cursor: pointer;
}
</style>
