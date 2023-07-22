<template>
  <!-- Clouds Far -->
  <div class="sky-wrapper">
    <img
      class="parallax-transition"
      id="clouds-far-svg"
      alt="Clouds Far"
      :src="cloudsFar"
    />
    <!-- Clouds Middle -->
    <img
      class="parallax-transition"
      id="clouds-middle-svg"
      alt="Clouds Middle"
      :src="cloudsMiddle"
    />
    <!-- Clouds Near -->
    <img
      class="parallax-transition"
      id="clouds-near-svg"
      alt="Clouds Near"
      :src="cloudsNear"
    />
    <!-- Moon -->
    <img
      class="parallax-transition"
      id="moon-city-svg"
      alt="Moon"
      :src="moonCity"
    />
    <!-- Stars -->
    <img
      class="parallax-transition"
      id="star-city-svg"
      alt="Stars"
      :src="starCity"
    />
  </div>

  <!-- Far Buildings -->
  <div class="ground-wrapper">
    <img
      class="parallax-transition"
      id="far-buildings-svg"
      alt="Far Buildings"
      :src="farBuildings"
    />
    <!-- Seattle -->
    <img
      class="parallax-transition"
      id="seattle-city-svg"
      alt="City of Seattle"
      :src="seattle"
    />
    <!-- Mt Rainier -->
    <img
      class="parallax-transition"
      id="mt-rainier-svg"
      alt="Mt Rainier"
      :src="mtRainier"
    />
    <!-- Mt Range -->
    <img
      class="parallax-transition"
      id="mt-range-svg"
      alt="Mt Range"
      :src="mtRange"
    />
    <!-- City Shine -->
    <img
      class="parallax-transition"
      id="city-shine-svg"
      alt="City Shine"
      :src="cityShine"
    />
    <!-- Larger Buildings -->
    <img
      class="parallax-transition"
      id="large-buildings-svg"
      alt="City Shine"
      :src="largeBuildings"
    />
    <!-- Background Lights -->
    <img
      class="parallax-transition"
      id="bg-lights-svg"
      alt="Background Lights"
      :src="bgLights"
    />
  </div>

  <!-- Background Image -->
  <div class="background-base" :class="{ blur: isModalOpen || isBlogOpen }">
    <img id="background-svg" alt="landscape" :src="backgroundImage" />
  </div>
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

    const backgroundImage = require("@/assets/img/city/background.svg");
    /* City Scene
        Moving Clouds, cities, and moon
    */
    const cloudsMiddle = require("@/assets/img/city/cloudsmiddle.svg");
    const cloudsNear = require("@/assets/img/city/cloudsnear.svg");
    const cloudsFar = require("@/assets/img/city/cloudsfar.svg");
    const moonCity = require("@/assets/img/city/moon.svg");
    const starCity = require("@/assets/img/city/stars.svg");
    const mtRainier = require("@/assets/img/city/mt-rainier.svg");
    const mtRange = require("@/assets/img/city/mt-range.svg");
    const farBuildings = require("@/assets/img/city/far-buildings.svg");
    const bgLights = require("@/assets/img/city/bglights.svg");
    const seattle = require("@/assets/img/city/seattle.svg");
    const cityShine = require("@/assets/img/city/cityshine.svg");
    const largeBuildings = require("@/assets/img/city/largebuildings.svg");
    return {
      store,
      isModalOpen,
      isBlogOpen,
      backgroundImage,
      cloudsMiddle,
      cloudsNear,
      cloudsFar,
      moonCity,
      starCity,
      mtRainier,
      mtRange,
      farBuildings,
      bgLights,
      seattle,
      cityShine,
      largeBuildings,
    };
  },
};
</script>

<style lang="scss" scoped>
.blur img {
  filter: blur(20px) !important;
}
</style>
