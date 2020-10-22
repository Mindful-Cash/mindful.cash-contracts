<template>
  <div class="page-container">
    FIND A GURU
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "FindAGuru",
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
