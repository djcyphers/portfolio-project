<template>
  <!-- Main Background -->
  <!-- Clouds Far -->
  <div class="clouds-far">
    <img id="clouds-far-svg" alt="Clouds Far" :src="cloudsFar" />
  </div>
  <!-- Clouds Middle -->
  <div class="clouds-middle">
    <img id="clouds-middle-svg" alt="Clouds Middle" :src="cloudsMiddle" />
  </div>
  <!-- Clouds Near -->
  <div class="clouds-near">
    <img id="clouds-near-svg" alt="Clouds Near" :src="cloudsNear" />
  </div>
  <div
    id="parallax-bg"
    class="parallax"
    :class="{ blur: isModalOpen || isBlogOpen }"
  >
    <img id="main-bg" alt="landscape" :src="backgroundImage" />
  </div>
  <!-- Parallax Layer A -->
</template>

<script>
import { inject, computed } from "vue";
export default {
  name: "Background",
  setup() {
    // Inject store from store/index.js
    const store = inject("store");

    const isModalOpen = computed(() => store.state.isModalOpen);
    const isBlogOpen = computed(() => store.state.isBlogOpen);

    const backgroundImage = require("@/assets/img/tacomacityscape-opacity40.png");
    /* City Scene
        Moving Clouds, cities, and moon
    */
    const cloudsMiddle = require("@/assets/img/city/cloudsmiddle.svg");
    const cloudsNear = require("@/assets/img/city/cloudsnear.svg");
    const cloudsFar = require("@/assets/img/city/cloudsfar.svg");
    return {
      store,
      isModalOpen,
      isBlogOpen,
      backgroundImage,
      cloudsMiddle,
      cloudsNear,
      cloudsFar,
    };
  },
};
</script>

<style lang="scss" scoped>
.blur img {
  filter: blur(20px) !important;
}
</style>
