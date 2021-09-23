<template>
  <div id="parallax-bg" class="parallax">
    <img id="main-bg" alt="landscape" :src="src" />
  </div>
</template>

<script>
export default {
  name: "Background",
  data() {
    return {
      src: require("@/assets/img/tacomacityscape-opacity40.png"),
    };
  },
};
</script>
