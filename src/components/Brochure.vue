<template>
    <div class="card text-white bg-black mb-3 border-0 mt-4 about-section">
        <h2 class="mt-3 text-center">Brochure</h2>
            
        <div class="brochure" @click="animateBrochure()">
            <div class="leftcard">
              <div class="leftpanel-inner" :class="{ folded: brochureOpen, delay: !brochureOpen }">
                <div class="leftpanel-front">
                  <img :src="brochurePage1" alt="Front Page">
                </div>
                <div class="leftpanel-back">
                  <img :src="brochurePage2" alt="Front Page Back">
                </div>
              </div>
            </div>
            <div class="centercard">
              <img :src="brochurePage4" alt="Center Page">
            </div>
            <div class="rightcard">
              <div class="rightpanel-inner" :class="{ folded: brochureOpen }">
                  <div class="rightpanel-front">
                    <img :src="brochurePage5" alt="Right Page Front">
                  </div>
                  <div class="rightpanel-back">
                    <a class="pdf-link" :href="pdfLink">PDF</a>
                    <a class="img-link" :href="imgLink" download>Image</a>
                    <p class="download-text">Download</p>
                    <img class="center-page" :src="brochurePage3" alt="Front Page Back">
                  </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
export default {
    name: "Brochure",
    setup() {

        // Downloads
        const pdfLink = "/BrochureCyphersTech.pdf";
        const imgLink = require("@/assets/brochure/BrochureCyphersTech.png");

        // Brochure Images
        const brochurePage1 = require("@/assets/brochure/Page1.jpg");
        const brochurePage2 = require("@/assets/brochure/Page2.jpg");
        const brochurePage3 = require("@/assets/brochure/Page3.jpg");
        const brochurePage4 = require("@/assets/brochure/Page4.jpg");
        const brochurePage5 = require("@/assets/brochure/Page5.jpg");
        // Animation
        const brochureOpen = ref(false);

        const animateBrochure = () => {
            brochureOpen.value = !brochureOpen.value;
        };

        return {
           pdfLink,
           imgLink,
           animateBrochure,
           brochureOpen,
           brochurePage1,
           brochurePage2,
           brochurePage3,
           brochurePage4,
           brochurePage5,
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    width: 100%;
    height: 255px;
    cursor: pointer;
}

.pdf-link {
  position: absolute;
  font-size: 20px;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index:2;
}

.img-link {
  position: absolute;
  font-size: 20px;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index:32;
}

.download-text {
  position: absolute;
  font-size: 10px;
  color: black;
  top: 90.5%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index:3;
}

// Brochure
.brochure {
  position: relative;
  text-align: center;
  width: 100%;
  height: 255px;
}

.leftcard {
  position:absolute;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  background-color: transparent;
  width: 80px;
  height: 180px;
  perspective: 1000px;
  z-index: 2;
}

.leftpanel-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  transform-origin: left;
}

.leftpanel-inner.folded {
  transform: rotateY(-180deg);
}

.leftpanel-front, .leftpanel-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.leftpanel-front {
  height: 100%;
}

.leftpanel-front img, .leftpanel-back img, .rightpanel-front img, .rightpanel-back img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.delay {
  transition-delay: 2s;
}

.leftpanel-back {
  height: 100%;
  transform: rotateY(180deg);
}

.centercard {
  position: absolute;
  height: 100%;
  box-sizing: border-box;
  width: 80px;
  height: 180px;
  display:inline-block;
  z-index: -1;
}

.centercard img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.rightcard {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  background-color: transparent;
  width: 80px;
  height: 180px;
  perspective: 1000px;
  z-index: 2;
}

.rightpanel-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transition-delay: 1s;
  transform-style: preserve-3d;
  transform-origin: right;
}

.rightpanel-inner.folded {
  transform: rotateY(180deg);
}

.rightpanel-front, .rightpanel-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.rightpanel-front {
  height: 100%;
  background-color: white;
}

.rightpanel-back {
  height: 100%;
  background-color: white;
  transform: rotateY(180deg);
}

// Remove default link styles
a:link { text-decoration: none; }

a:visited { text-decoration: none; }

a:hover { text-decoration: none; }

a:active { text-decoration: none; }

// Add a better link style
a {
  text-decoration: none;
  color: #18272F;
  font-weight: 700;
  position: relative;
}

a::before {
  content: '';
  background-color: hsla(196, 61%, 58%, .75);
  position: absolute;
  left: 0;
  bottom: 3px;
  width: 100%;
  height: 8px;
  z-index: 2;
  transition: all .3s ease-in-out;
}

a:hover::before {
  bottom: 0;
  height: 100%;
}

</style>