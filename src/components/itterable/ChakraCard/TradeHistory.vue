<template>
  <div class="md-layout" style="text-align: left">
    <div class="md-layout-item" style="padding-bottom:20px">
      <img id="history-large" src="@/assets/svg/chakra-history-page.svg" />
    </div>
  </div>
</template>

<script>
export default {
  name: "TradeHistory",
  components: {},
  props: {
    HistoryInfo: {
      type: Array,
      required: true
    }
  },
  methods: {},
  computed: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
#history-large {
  background-position-y: 25% !important;
  // background-position-x: 100%;
  background-size: contain;
  // height: 150%;
  width: 100%;
}
</style>
