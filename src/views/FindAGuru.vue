<template>
  <div class="page-container" style="padding-top:200px">
    <h1 class="heading">
      Coming Soon
    </h1>
    <span class="secondary-text">In the mean time start aligning your chakras...</span>
    <br />
    <br />
    <button class="highlight-btn" style="cursor: pointer;font-size: 16px;" @click="goToApp">
      <span>Align Your Chakras</span>
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import router from "@/router";
export default {
  name: "FindAGuru",
  components: {},
  data: () => ({}),
  props: {},
  methods: {
    goToApp() {
      router.push({ path: "/app" });
    }
  },
  computed: {
    ...mapState(["x"])
  }
};
</script>

<style lang="scss" scoped>
.secondary-text {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  color: #292929;
}

.heading {
  font-size: 3rem;
  font-weight: 600;
  line-height: 4.5rem;
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  background-clip: text;
  color: transparent;
  margin: 0 0 3rem 0;
}

.highlight-btn {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  margin: 2rem 0;

  span {
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
