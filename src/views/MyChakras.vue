<template>
  <div class="page-container" style="padding-bottom:100px">
    <div v-if="chakras == null">
      LOADING
    </div>
    <div v-if="chakras != null">
      <div class="md-layout" v-if="chakras.length != 0 && !createFlowEnabled">
        <div class="md-layout-item">
          <transition-group name="fadeUp">
            <Chakra-Card
              v-for="chakra in chakras"
              :chakraInfo="chakra"
              class="chakra-card"
              :key="chakra.metaData.smartPoolAddress"
            />
          </transition-group>
        </div>
      </div>
      <div class="md-layout" v-if="chakras.length == 0 && !createFlowEnabled">
        <div class="md-layout-item">
          <md-content>
            <div style="padding-top: 200px; padding-left: 20px; padding-right: 20px; color: #292929;">
              <h1>You don’t have any Chakras yet...</h1>
            </div>

            <md-button class="create-button" @click="createFlow = true">Create Chakra</md-button>
            <p class="sample-chakra" @click="loadSampleChakra">Or load a sample Chakra</p>
          </md-content>
        </div>
      </div>
    </div>
    <Chakra-Flow v-if="createFlowEnabled == true" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import ChakraFlow from "@/views/ChakraFlow";
import ChakraCard from "@/components/itterable/ChakraCard/ChakraCard.vue";

export default {
  name: "MyChakras",
  components: { ChakraCard, ChakraFlow },
  data: () => ({ createFlow: false }),
  props: {
    createFlowOverride: { type: Boolean, required: true }
  },
  methods: {
    ...mapActions(["getSampleUserChakra"]),
    loadSampleChakra() {
      console.log("loading sample");
      this.getSampleUserChakra();
    }
  },
  computed: {
    ...mapState(["chakras"]),
    createFlowEnabled() {
      return this.createFlow || this.createFlowOverride;
    }
  }
};
</script>

<style lang="scss" scoped>
.chakra-card {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 12px !important;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  width: 100%;
  padding: 0;
}

.box-text {
  text-align: justify;
  text-justify: inter-word;
  background: none;
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

.create-button {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%) !important;
  border-radius: 8px !important;
  width: 199px;
  height: 40px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff !important;
  text-transform: none !important;
}

.sample-chakra {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  align-items: center !important;
  text-align: center !important;
  color: #aaaaaa;
  cursor: pointer;
}
</style>
