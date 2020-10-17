<template>
  <div class="about">
    <div>
      {{ tabIndex }}
      <md-tabs md-sync-route>
        <md-tab id="tab-home" md-label="My Chakras" @click="tabIndex = 0" exact></md-tab>
        <md-tab md-label="Find Gurus" @click="tabIndex = 1" exact></md-tab>
        <md-tab md-label="Stats" @click="tabIndex = 2" exact></md-tab>
      </md-tabs>
      <div class="main-section" style="padding-top: 20px">
        <My-Chakras v-if="tabIndex == 0" />
      </div>
    </div>
  </div>
</template>

<script>
import MyChakras from "@/views/MyChakras";
export default {
  name: "Home",
  components: { MyChakras },
  data() {
    return { tabIndex: 0 };
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

.main-section {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 12px !important;
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
  width: 100%;
  margin-top: 1rem;
  padding: 0;
}
</style>
