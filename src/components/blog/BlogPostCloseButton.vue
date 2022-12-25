<!-- Animated Close Button -->
<!-- Credit https://codepen.io/maneeshc -->
<template>
<div class="button-wrapper">
  <!-- Don't need to "close" the button, use @click on component from parent -->
  <a href="#" class="close-button" @click="clearLocalStorage()">
    <div class="in">
      <div class="close-button-block"></div>
      <div class="close-button-block"></div>
    </div>
    <div class="out">
      <div class="close-button-block"></div>
      <div class="close-button-block"></div>
    </div>
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
$button-size: 40px;
$close-width: ($button-size / 10);
.button-wrapper {
  width: 40px;
  height: 40px;
  float: right;
  left: 57vw;
  position: absolute;
  top: 3vh;
}

.close-button {
  display: block;
  width: $button-size;
  height: $button-size;
  position: relative;
  overflow: hidden;
  > div {
    position: relative;
  }
  &-block {
    width: 40px;
    height: 20px;
    position: relative;
    overflow: hidden;
    &:before,
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: calc(55% - 0.22em);
      display: block;
      width: 1px;
      height: 30px;
      transform-origin: bottom center;
      background: white;
      transition: all ease-out 280ms;
    }
    &:last-of-type {
      transform: rotate(180deg);
    }
  }
  .in {
    .close-button-block {
      &:before {
        transition-delay: 280ms;
        transform: translateX(20px) translateY(-20px) rotate(45deg);
      }
      &:after {
        transition-delay: 280ms;
        transform: translateX(-22px) translateY(-22px) rotate(-45deg);
      }
    }
  }
  .out {
    position: absolute;
    top: 0;
    left: 0;
    .close-button-block {
      &:before {
        transform: translateX(-5px) translateY(5px) rotate(45deg);
      }
      &:after {
        transform: translateX(5px) translateY(5px) rotate(-45deg);
      }
    }
  }
  &:hover {
    .in {
      .close-button-block {
        &:before {
          transform: translateX(-5px) translateY(5px) rotate(45deg);
        }
        &:after {
          transform: translateX(5px) translateY(5px) rotate(-45deg);
        }
      }
    }
    .out {
      .close-button-block {
        &:before {
          transform: translateX(-20px) translateY(20px) rotate(45deg);
        }
        &:after {
          transform: translateX(20px) translateY(20px) rotate(-45deg);
        }
      }
    }
  }
}
</style>