<template>
  <!-- Clouds Far -->
  <div class="sky-wrapper" :class="{ blur: isModalOpen || isBlogOpen }">
    <img
      class="parallax-transition"
      id="clouds-far-svg"
      alt="Clouds Far"
      :src="cloudsFar"
    />
    <template v-if="isMobileSize">
      <img
        class="parallax-transition"
        id="clouds-far-svg-2"
        alt="Clouds Far"
        :src="cloudsFar"
      />
    </template>
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
    <div
      v-if="activeStar"
      class="star"
      :style="{
        left: activeStar.x + 'px',
        top: activeStar.y + 'px',
        animationDuration: activeStar.duration + 's',
      }"
      @animationend="resetStar"
    ></div>
    <img
      class="parallax-transition"
      id="star-city-svg"
      alt="Stars"
      :src="starCity"
    />
    <template v-if="isMobileSize">
      <img
        class="parallax-transition"
        id="star-city-svg-2"
        alt="Stars"
        :src="starCity"
      />
    </template>
    <template v-if="isMobileSize">
      <img
        class="parallax-transition"
        id="star-city-svg-3"
        alt="Stars"
        :src="starCity"
      />
    </template>
  </div>

  <!-- Far Buildings -->
  <div class="ground-wrapper" :class="{ blur: isModalOpen || isBlogOpen }">
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
import { inject, computed, onMounted, onUnmounted, ref } from "vue";
export default {
  name: "Background",
  setup() {
    // Inject store from store/index.js
    const store = inject("store");
    const activeStar = ref(null);

    // Window Blur Effects
    const isModalOpen = computed(() => store.state.isModalOpen);
    const isBlogOpen = computed(() => store.state.isBlogOpen);

    // Window Resize Events (Duplicate Objects)
    let isMobileSize = ref(false);

    onMounted(() => {
      window.addEventListener("resize", handleWindowSizeChange);
      handleWindowSizeChange();
      shootingStar();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleWindowSizeChange);
    });

    // Shooting Star Effect
    const shootingStar = () => {
      const star = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight / 2),
        duration: Math.random() * 2 + 1, // Randomize animation duration between 1 and 6 seconds
      };

      activeStar.value = star;

      setTimeout(() => {
        activeStar.value = null;
        shootingStar();
      }, (star.duration + 1) * 1000); // Wait for the animation to finish before removing the star
    };

    const resetStar = () => {
      activeStar.value = null;
    };

    const handleWindowSizeChange = () => {
      if ($(window).width() < 740) {
        isMobileSize.value = true;
      } else {
        isMobileSize.value = false;
      }
    };

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
      isMobileSize,
      handleWindowSizeChange,
      shootingStar,
      activeStar,
      resetStar,
    };
  },
};
</script>

<style lang="scss" scoped>
.blur img {
  filter: blur(20px) brightness(30%) !important;
}

// Shooting Star
.star {
  width: 2px;
  height: 2px;
  background-color: #ffc2c2;
  border-radius: 50%;
  position: absolute;
  animation: shooting-star 3s linear infinite;
  z-index: 4;
}

@keyframes shooting-star {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(400px, 400px) scale(0.2);
  }
}
</style>
