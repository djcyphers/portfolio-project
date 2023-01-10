<!-- Glowing Close Button -->
<template>
    <div class="gallery-close-button" @click="clearLocalStorage()">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <svg viewBox="0 0 36 36" class="circle">
            <path
            stroke-dasharray="100, 100"
            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
        </svg>
    </div>
</template>
<script>
export default {
    name: "GalleryCloseButton",
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
.gallery-close-button {
  $size: 60px;
  $borderSize: 2px;
  $borderColor: rgba(white,1);
  $speed: .5s;
  left: 80%;
  width:$size;
  height:$size;
  position: relative;
  background: #455A64;
  border-radius:50%;
  box-shadow: 0 0 20px -5px rgba(white,.5);
  transition: .25s ease-in-out;
  cursor: pointer;
  animation: fade-in $speed ease-out .25s both;
  @keyframes fade-in {
    from { opacity: 0; transform:scale(1.1) }
  }
  .circle {
    path {
      stroke: $borderColor;
      fill: none;
      stroke-width: calc($borderSize / 2);
      stroke-linecap: round;
      animation: progress $speed ease-out .25s both;
      @keyframes progress {
        from { stroke-dasharray: 0 100; }
      }
    }
  }
  span{
    display:block;
    width: calc(($size / 4) - 2px);
    height:$borderSize;
    background: $borderColor;
    box-shadow: 0 0 20px -5px rgba(white,.5);
    border-radius: 20px;
    position: absolute;
    $padding: calc($size / 3);
    transition: .25s ease-in-out;
    animation: slide-in $speed ease-in-out .25s both;
    @keyframes slide-in {
      from { width:0; }
    }
    &:nth-child(1){
      top: calc($padding - ($borderSize / 2));
      left:$padding;
      transform:rotate(45deg);
      transform-origin: top left;
    }
    &:nth-child(2){
      top: calc($padding - ($borderSize / 2));
      right:$padding;
      transform:rotate(-45deg);
      transform-origin: top right;
    }
    &:nth-child(3){
      bottom: calc($padding - ($borderSize / 2));
      left:$padding;
      transform:rotate(-45deg);
      transform-origin: bottom left;
    }
    &:nth-child(4){
      bottom: calc($padding - ($borderSize / 2));
      right:$padding;
      transform:rotate(45deg);
      transform-origin: bottom right;
    }
  }
  &:hover{
    background: #37474F;
    span{
      width:calc($size / 4);
    }
  }
}
</style>