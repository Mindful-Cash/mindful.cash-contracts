<template>
  <md-card style="padding: 30px">
    <div class="md-layout">
      <!-- <div class="md-layout-item md-size-20">1</div>
      <div class="md-layout-item">2</div> -->
    </div>
    <!-- {{ chakraInfo }} -->
    <div v-if="chartInfo">
      <Portfolio-Chart :chartInfo="chartInfo" />
    </div>
  </md-card>
</template>

<style lang="scss" scoped>
.card-expansion {
  height: 480px;
}
.md-card {
  width: 1000px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.box-text {
  text-align: justify;
  text-justify: inter-word;
}

// Link styling
.a:link {
  color: #af0404;
  text-decoration: none;
}

/* visited link */
.a:visited {
  color: #fc6161;
  text-decoration: underline;
}

/* mouse over link */
.a:hover {
  color: #fc6161;
}

/* selected link */
.a:active {
  color: #fc6161;
  text-decoration: underline;
}
</style>
<script>
import { mapActions, mapState } from "vuex";

import PortfolioChart from "./PortfolioChart";

export default {
  name: "ChakraCard",
  components: { PortfolioChart },
  data: () => ({ fomoIn: false, offer: 0 }),
  props: {
    chakraInfo: {
      type: Object,
      required: true,
    },
  },
  computed: {
    pageUrl() {
      // return window.location.href;
    },
    chartInfo() {
      if (this.chakraInfo.chartInfo) {
        return this.chakraInfo.chartInfo;
      } else return null;
    },
  },
  methods: {
    ...mapActions(["X"]),
  },
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
</style>
