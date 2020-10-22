<template>
  <div class="segment">
    <div class="md-layout">
      <div
        v-for="(title, index) in titles"
        class="md-layout-item"
        :class="selected == index ? 'selectedSection' : 'notSelectedSection'"
        @click="handleSelection(index)"
        :key="title + '-' + index"
      >
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Segment",
  props: { titles: { type: Array } },
  data: () => ({ selected: 0 }),
  methods: {
    handleSelection(index) {
      this.selected = index;
      this.$emit("update-selected", this.titles[index]);
    }
  }
};
</script>

<style lang="scss" scoped>
.segment {
  width: 100%;
  height: 40px;
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: 0.5rem;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}

.selectedSection {
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  height: 40px;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #ffffff;
  vertical-align: middle;
  display: inline-block;
  padding-top: 10px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 0.5rem;
}

.notSelectedSection {
  height: 40px;
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  align-items: center;
  text-align: center;
  line-height: 19px;
  vertical-align: middle;
  padding-top: 10px;
  cursor: pointer;
  transition: 0.3s;
  color: #aaaaaa;
  border-radius: 0.5rem;
}
</style>
