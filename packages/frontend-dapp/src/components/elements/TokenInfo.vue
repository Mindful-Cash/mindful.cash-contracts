<template>
  <div class="tokenInfo">
    <p>Price: {{ formatPrice() }}</p>
    <p>Balance: {{ balance }}</p>
  </div>
</template>

<script>
export default {
  name: "TokenInfo",
  props: {
    price: {
      default: 0,
      type: Number
    },
    balance: {
      default: 0,
      type: Number
    }
  },
  methods: {
    formatPrice() {
      return `$${this.price}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.tokenInfo {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

p {
  font-size: 0.875rem;
  color: #aaa;
  margin: 0 0 0 1rem;
}
</style>
