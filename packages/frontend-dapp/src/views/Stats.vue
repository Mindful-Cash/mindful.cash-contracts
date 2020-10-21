<template>
  <div class="page-container">
    MINDFUL STATS
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Stats",
  components: {},
  data: () => ({}),
  props: {},
  methods: {
    ...mapActions(["x"])
  },
  computed: {
    ...mapState(["x"])
  }
};
</script>

<style lang="scss" scoped></style>
