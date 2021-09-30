<template>
  <router-view />
</template>

<style lang="scss">
@import "./assets/scss/global.scss";
</style>

<script>
export default {
  name: "App",
  mounted() {
    this.$nextTick(function () {
      // Stupid hacky fix for piece of crap Chromium *barf*
      document.getElementById("app").style = "overflow-anchor: none";
    });
  },
};
</script>
