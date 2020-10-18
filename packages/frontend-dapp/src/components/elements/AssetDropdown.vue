<template>
  <div class="dropdown" @click="$emit('show-modal')">
    <img :width="20" :height="20" v-if="asset.logoURI" :src="asset.logoURI" style="padding-bottom: 5px" />
    <span style="padding-bottom: 5px"> {{ asset.symbol }} </span>
    <md-icon style="padding-bottom: 5px">keyboard_arrow_down</md-icon>
  </div>
</template>

<script>
export default {
  name: "AssetDropdown",
  props: ["asset"]
};
</script>

<style lang="scss" scoped>
.dropdown {
  border: 1px solid #dddddd;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 10px;
  height: 2.5rem;
  border: 1px solid #aaa;
  color: #aaa;
  text-align: center;
  width: 95%;
  background: none;
  box-shadow: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;

  span {
    transition: all ease-in-out 0.5s;
    font-size: 1rem;
  }

  &:hover {
    border: 1px solid #00e0ff;

    span {
      background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
