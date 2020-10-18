<template>
  <div class="tokenInput">
    <input placeholder="0" type="number" v-model="allowance" />
    <div class="side">
      <button v-if="state === 'default'" @click="handleClick()">Approve</button>
      <md-progress-spinner
        v-else-if="state === 'loading'"
        class="md-accent"
        :md-diameter="20"
        :md-stroke="2"
        md-mode="indeterminate"
      />
      <md-icon v-else-if="state === 'complete'" style="color:#fff">check_circle_outline</md-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "TokenInput",
  props: {
    state: {
      default: "default",
      type: "default" | "loading" | "complete"
    }
  },
  data: () => ({ allowance: undefined }),
  methods: {
    handleClick() {
      this.$emit("approve-token", this.allowance);
    }
  }
};
</script>

<style lang="scss" scoped>
.tokenInput {
  width: 100%;
  display: flex;
}

.side {
  width: 8rem;
  background: linear-gradient(74.67deg, #00e0ff -6.3%, #aa55ff 111.05%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  color: #fff;
  overflow: hidden;
}

button {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  font-size: 1rem;
  color: #fff;
  background: none;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    background: linear-gradient(74.67deg, #00bcd4 -6.3%, #8f44da 111.05%);
  }
}

input {
  border: none;
  box-shadow: inset 0 0 0 1px #ddd;
  border-radius: 0.5rem;
  margin-right: -0.5rem;
  color: #aaa;
  background: none;
  border-radius: 0.5rem;
  height: 2.5rem;
  box-sizing: border-box;
  width: 95%;
  padding: 0 1rem;
  font-size: 1rem;

  &:focus {
    border: 1px solid #00e0ff;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
}
</style>
