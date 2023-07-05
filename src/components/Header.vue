<template>
  <div id="header">
    <!-- <div id="firefly"></div> -->
    <ul id="menu">
      <li>
        <a
          @click="closeBlogYearFilter()"
          href="#home"
          class="link"
          data-menu="box1"
          >Home</a
        >
      </li>
      <li>
        <a
          @click="closeBlogYearFilter()"
          href="#about"
          class="link"
          data-menu="box2"
          >About</a
        >
      </li>
      <li>
        <a
          @click="closeBlogYearFilter()"
          href="#portfolio"
          class="link portfolio-close"
          data-menu="box3"
          >Portfolio</a
        >
      </li>
      <li>
        <a
          @click="openBlogYearFilter()"
          href="#social"
          class="link"
          data-menu="box4"
          >Social</a
        >
      </li>
    </ul>
  </div>
  <Transition name="fade">
    <div
      v-if="isMenuDropping"
      class="drop-bar"
      :class="{ dropmenu: isMenuDropping }"
    >
      <h2 class="navbar-title">My Blog - Music, Life, Musings</h2>
      <h3 class="navbar-title-mobile">My Blog</h3>
    </div>
  </Transition>
</template>

<script setup>
import { inject, computed } from "vue";

const store = inject("store");

let isMenuDropping = computed(() => store.state.isBlogOpen);

function openBlogYearFilter() {
  store.state.isBlogYearFilterOpen = true;
}

function closeBlogYearFilter() {
  store.state.isBlogYearFilterOpen = false;
}
</script>

<style lang="scss" scoped>
.navbar-title {
  margin-left: 20px;
  margin-top: 7px;
}

.navbar-title-mobile {
  display: none;
}

/* Iphone 6/7/8 and Android (Portrait)----------- */
@media only screen and (min-height: 666px) and (max-width: 469px) and (min-width: 360px) {
  .navbar-title {
    display: none;
  }

  .navbar-title-mobile {
    display: block;
    margin-top: 18px;
    margin-left: 20px;
    color: white;
  }
}
.dropmenu {
  position: fixed;
  background-color: #000000;
  overflow: hidden;
  top: 0;
  height: 60px;
  width: 100%;
  z-index: 9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
