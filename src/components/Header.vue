<template>
  <div id="header">
    <ul id="menu">
      <li>
        <a
          @click="
            closeBlogYearFilter();
            saveMenuStateSessionStorage($event);
          "
          href="#home"
          class="link"
          data-menu="box1"
          >Home</a
        >
      </li>
      <li>
        <a
          @click="
            closeBlogYearFilter();
            saveMenuStateSessionStorage($event);
          "
          href="#about"
          class="link"
          data-menu="box2"
          >About</a
        >
      </li>
      <li>
        <a
          @click="
            closeBlogYearFilter();
            saveMenuStateSessionStorage($event);
          "
          href="#portfolio"
          class="link portfolio-close"
          data-menu="box3"
          >Portfolio</a
        >
      </li>
      <li>
        <a
          @click="
            openBlogYearFilter();
            saveMenuStateSessionStorage($event);
          "
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
import { inject, computed, ref, onMounted, nextTick } from "vue";

const store = inject("store");

const elementData = ref();

// In case of accidental browser refresh, load the last menu item that was selected
onMounted(() => {
  const sessionStorage = window.sessionStorage;
  // Can't stack click().classList, too bad.
  nextTick(() => {
    switch (sessionStorage.getItem("menuState")) {
      case "#home":
        document.querySelectorAll("[data-menu='box1']")[0].click();
        document
          .querySelectorAll("[data-menu='box1']")[0]
          .classList.add("selected");
        break;

      case "#about":
        document.querySelectorAll("[data-menu='box2']")[0].click();
        document
          .querySelectorAll("[data-menu='box2']")[0]
          .classList.add("selected");
        break;

      case "#portfolio":
        document.querySelectorAll("[data-menu='box3']")[0].click();
        document
          .querySelectorAll("[data-menu='box3']")[0]
          .classList.add("selected");
        break;

      case "#social":
        document.querySelectorAll("[data-menu='box4']")[0].click();
        document
          .querySelectorAll("[data-menu='box4']")[0]
          .classList.add("selected");
        break;

      default:
        document.querySelectorAll("[data-menu='box1']")[0].click();
        document
          .querySelectorAll("[data-menu='box1']")[0]
          .classList.add("selected");
    }
  });
});

let isMenuDropping = computed(() => store.state.isBlogOpen);

function openBlogYearFilter() {
  store.state.isBlogYearFilterOpen = true;
}

function closeBlogYearFilter() {
  store.state.isBlogYearFilterOpen = false;
}

// Save last menu state to retrieve onMounted / onLoaded
function saveMenuStateSessionStorage(event) {
  const sessionStorage = window.sessionStorage;
  elementData.value = event.target;
  sessionStorage.setItem(
    "menuState",
    elementData.value.attributes[1].nodeValue
  );
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
  z-index: 12;
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
