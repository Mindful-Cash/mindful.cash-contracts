<template>
  <div class="about">
    <div>
      <div class="md-layout" style="text-align: left">
        <div class="md-layout-item">
          <md-button :class="tabIndex == 0 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 0"
            ><img
              v-if="tabIndex == 0"
              :fill="'green'"
              class="icon-selected"
              src="@/assets/svg/icons/chakra-active.svg"
              alt="logo"
            />
            <img
              v-if="tabIndex != 0"
              :fill="'green'"
              class="icon-selected"
              src="@/assets/svg/icons/chakra-inactive.svg"
              alt="logo"
            />
            My Chakras
          </md-button>
          <md-button :class="tabIndex == 1 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 1"
            ><img src="@/assets/svg/guru.svg" alt="logo" /> Find a Guru</md-button
          >
          <md-button :class="tabIndex == 2 ? 'selected-tab' : 'not-selected-tab'" @click="tabIndex = 2"
            ><img v-if="tabIndex == 2" src="@/assets/svg/icons/history-active.svg" alt="logo" />
            <img v-if="tabIndex != 2" src="@/assets/svg/icons/history-inactive.svg" alt="logo" />
            Stats</md-button
          >
        </div>
        <div
          class="md-layout-item new-chakra"
          style="text-align: right"
          @click="createFlowOverride = true"
          v-if="!createFlowOverride && userAddress"
        >
          <img src="@/assets/svg/new-chakra.svg" alt="logo" style="padding-right:5px;padding-bottom:2px" /><span
            >New Chakra</span
          >
        </div>
      </div>
      <hr />
      <div class="main-section" style="padding-top: 20px">
        <My-Chakras :createFlowOverride="createFlowOverride" v-if="tabIndex == 0 && userAddress" />
      </div>
    </div>
  </div>
</template>

<script>
import MyChakras from "@/views/MyChakras";
import ChakraFlow from "@/views/ChakraFlow";
// import guru from "@/assets/svg/guru.svg";
// import chakra from "./assets/svg/chakra.svg";
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  components: { MyChakras },
  data() {
    return { tabIndex: 0, createFlowOverride: false };
  },
  computed: {
    ...mapState(["userAddress"])
  }
};
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.md-tabs .md-tabs-navigation {
  background: none !important;
}

.md-tabs .md-tab .md-active {
  background: blue;
}

.not-selected-tab {
  width: 150px;
  text-transform: none !important;
  margin-bottom: 0px !important;
  border-radius: 0 !important;
}
.selected-tab {
  border-radius: 0 !important;
  border-bottom: none;
  width: 150px;
  color: #27c8d2 !important;
  text-transform: none !important;
  font-weight: 800 !important;
  font-family: Inter;
  font-style: normal;
  font-size: 16px !important;
  line-height: 17px;
  transition: all ease-in-out 0.5s;
  margin-bottom: 0px !important;
}
.selected-tab:after {
  border-radius: 0 !important;
  content: "";
  background: #27c8d2 !important;
  display: block;
  height: 3px;
  width: 150px;
  position: absolute;
  bottom: 0;
  transition: all ease-in-out 0.5s;
  margin-bottom: 0px !important;
}

.new-chakra {
  padding-top: 15px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  align-items: center;
  color: #292929;
  cursor: pointer;
}

hr {
  border: 1px solid rgba(41, 41, 41, 0.1);
  margin-top: 0px;
}
</style>
