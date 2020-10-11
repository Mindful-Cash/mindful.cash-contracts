<template>
  <div class="page-container">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-content style="padding: 20px">
          <md-card-header>
            <div class="md-title"></div>
          </md-card-header>
          <md class="box-text">
            <p>
              view your Chakras
            </p>
          </md>
        </md-content>
        <transition-group name="fadeUp" tag="ul">
          <Chakra-Card v-for="chakra in chakras" :chakraInfo="chakra" style="margin:20px" :key="chakra.address" />
        </transition-group>
      </div>
    </div>
  </div>
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

import ChakraCard from "@/components/itterable/ChakraCard/ChakraCard.vue";

export default {
  name: "MyChakras",
  components: { ChakraCard },
  data: () => ({}),
  methods: {
    ...mapActions(["getMyChakras"])
  },
  mounted() {
    this.getMyChakras();
  },
  computed: {
    ...mapState(["chakras"])
  }
};
</script>
