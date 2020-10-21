import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMaterial from "vue-material";
import VueSimpleSVG from "vue-simple-svg";

import "vue-material/dist/vue-material.min.css";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import "typeface-space-mono";

import ToggleButton from "vue-js-toggle-button";
import VModal from "vue-js-modal";

// Non- typescript imports:
// @ts-ignore-start
import Jazzicon from "vue-jazzicon";
import VueApexCharts from "vue-apexcharts";
// @ts-ignore-end

Vue.component("apexchart", VueApexCharts);
Vue.component("VueSlider", VueSlider);
Vue.component("jazzicon", Jazzicon);

Vue.use(VueSimpleSVG);
Vue.use(ToggleButton);
Vue.use(VueApexCharts);
Vue.use(VueMaterial);
Vue.use(VModal);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
