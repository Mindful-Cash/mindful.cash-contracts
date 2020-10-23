<template>
  <div class="about">
    <div>
      <div class="md-layout" style="text-align: left">
        <div class="md-layout-item">
          <img
            @click="
              tabIndex = 0;
              createFlowOverride = false;
            "
            class="chakra-button-active"
            v-if="tabIndex == 0"
            src="@/assets/svg/tab/my-chakras-active.svg"
          />
          <img
            @click="tabIndex = 0"
            class="chakra-button-inactive"
            v-if="tabIndex != 0"
            src="@/assets/svg/tab/my-chakras-inactive.svg"
          />

          <img
            @click="tabIndex = 1"
            class="chakra-button-active"
            v-if="tabIndex == 1"
            src="@/assets/svg/tab/find-gurus-active.svg"
          />
          <img
            @click="tabIndex = 1"
            class="chakra-button-inactive"
            v-if="tabIndex != 1"
            src="@/assets/svg/tab/find-gurus-inactive.svg"
          />

          <img
            @click="tabIndex = 2"
            class="chakra-button-active"
            v-if="tabIndex == 2"
            src="@/assets/svg/tab/stats-active.svg"
          />
          <img
            @click="tabIndex = 2"
            class="chakra-button-inactive"
            v-if="tabIndex != 2"
            src="@/assets/svg/tab/stats-inactive.svg"
          />
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
        <Find-a-Guru v-if="tabIndex == 1 && userAddress" />
        <Stats v-if="tabIndex == 2 && userAddress" />
      </div>
    </div>
  </div>
</template>

<script>
import MyChakras from "@/views/MyChakras";
import FindAGuru from "@/views/FindAGuru";
import Stats from "@/views/Stats";

// import guru from "@/assets/svg/guru.svg";
// import chakra from "./assets/svg/chakra.svg";
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  components: { MyChakras, FindAGuru, Stats },
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

.chakra-button-inactive {
  cursor: pointer;
  padding-bottom: 0px !important;
  padding-left: 10px;
  padding-right: 10px;
}

.chakra-button-active {
  cursor: pointer;
}
</style>
