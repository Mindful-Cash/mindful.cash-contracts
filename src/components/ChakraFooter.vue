<template>
  <div class="chakra-footer">
    <div class="md-layout">
      <button @click="handleOnClick('BACK')">Back</button>
      <button @click="handleOnClick('SKIP')">Skip</button>
      <button @click="handleOnClick('NEXT')">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChakraFooter",
  data: () => ({
    index: 0
  }),
  methods: {
    handleOnClick(state) {
      console.log("test", state);
      const states = {
        BACK: this.$emit("back-press"),
        SKIP: this.$emit("skip-press"),
        NEXT: this.$emit("next-press")
      }[state];
    }
  }
};
</script>

<style lang="scss" scoped>
.chakra-footer {
  width: 100%;
  height: 40px;
  background: blue;
}
</style>
