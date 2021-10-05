<template>
  <router-view />
</template>

<style lang="scss">
@import "./assets/scss/global.scss";
</style>

<script>
import { provide } from "vue";
import store from "./store";

export default {
  name: "App",
  setup() {
    provide("store", store);
  },
  mounted() {
    this.$nextTick(function () {
      // Stupid hacky fix for Chromium
      document.getElementById("app").style = "overflow-anchor: none";
    });
  },
};
</script>
