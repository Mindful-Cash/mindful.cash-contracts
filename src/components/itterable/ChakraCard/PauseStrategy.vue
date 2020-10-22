<template>
  <div class="pause-modal" style="text-align: left">
    <h1 class="pause-strategy-text">Pause Strategy</h1>
    <hr />
    <!-- <div class="md-layout-item"> -->
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "PauseChakra",
  components: {},
  props: {
    chakraInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDataString(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  computed: {},
  data: () => ({}),

  computed: {}
};
</script>

<style lang="scss" scoped>
.pause-modal {
  width: 800px;
  height: 739px;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
.pause-strategy-text {
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;
  align-items: center;
  color: #292929;
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 5px;
}
</style>
