<template>
  <div class="md-layout" style="text-align: left">
    <div class="md-layout-item" v-if="underlyingTokens">
      <img
        v-for="(token, index) in underlyingTokens"
        :key="index"
        :width="30"
        :height="30"
        :src="token.logoURI"
        style="border-radius: 50%; position: relative;"
        :style="'left:' + -10 * index + 'px;'"
      />
      <md-icon
        style="position: relative; color:#292929;margin-left:5px;margin-right:5px"
        :style="'left:' + -10 * (underlyingTokens.length - 1) + 'px;'"
        >compare_arrows</md-icon
      >
      <img
        :width="30"
        :height="30"
        :left="-30"
        :src="dcaToken.logoURI"
        style="border-radius: 50%; position: relative;"
        :style="'left:' + -10 * (underlyingTokens.length - 1) + 'px;'"
      />
    </div>
    <!-- <div class="md-layout-item" v-if="underlyingTokens"></div> -->
  </div>
</template>

<script>
export default {
  name: "ChakraCoins",
  props: {
    underlyingTokens: {
      type: Array
    },
    dcaToken: {
      type: Object
    }
  }
};
</script>
