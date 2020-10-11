<template>
  <div class="about">
    <div>
      select chakra
      <md-tabs md-sync-route>
        <md-tab id="tab-home" md-label="Home" @click="tabIndex = 0" exact></md-tab>
        <md-tab md-label="Home2" @click="tabIndex = 1" exact></md-tab>
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
  },
};
</script>
