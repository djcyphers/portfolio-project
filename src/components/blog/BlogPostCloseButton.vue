<!-- Animated Close Button -->
<!-- Credit https://codepen.io/maneeshc -->
<template>
<div class="button-wrapper">
  <a href="#" id="close-button" @click="clearLocalStorage()">
    <i class="fa fa-times">
      <font-awesome-icon :icon="['fas', 'times']" />
    </i>
  </a>
</div>

</template>
<script>
export default {
    name: "BlogPostCloseButton",
    setup() {
      function clearLocalStorage() {
        localStorage.clear();
      }
      return {
        clearLocalStorage,
      }
    }
}
</script>
<style lang="scss" scoped>
#close-button {
  position: fixed;
  right: 18px;
  bottom: 25px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: black;
  color:white;
  font-size: 20px;
  padding: 0;
  animation: move-up 0.5s ease-out;
  animation-fill-mode: forwards;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* Add the move-up animation keyframe */
@keyframes move-up {
  0% {
    transform: translateY(-60px) scale(1);
  }
  50% {
    transform: translateY(-60px) scale(1.1);
  }
  100% {
    transform: translateY(-60px) scale(1);
  }
}

</style>