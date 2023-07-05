<template>
  <div class="container">
    <div
      id="about-section"
      class="row justify-content-center"
      :class="{ blur: isModalOpen }"
    >
      <div class="responsive-box col-md-6 col-lg-3 mt-2">
        <div
          class="card about-wrapper text-center"
          style="height: 255px !important"
        >
          <img
            :src="profilePic"
            class="card-img-top zoom about-image"
            alt="avatar"
          />

          <ul class="socialshare-icons mx-auto">
            <li>
              <a href="https://facebook.com/iheardancemusic">
                <font-awesome-icon :icon="['fab', 'facebook-square']" />
                <i class="fa fa-facebook-f"></i>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/djcyphers">
                <font-awesome-icon :icon="['fab', 'instagram-square']" />
                <i class="fa fa-instagram"></i>
              </a>
            </li>
            <li>
              <a href="https://twitter.com/djcyphers">
                <font-awesome-icon :icon="['fab', 'twitter-square']" />
                <i class="fa fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://disordapp.com/users/283115651885826048">
                <font-awesome-icon :icon="['fab', 'discord']" />
                <i class="fa fa-discord"></i>
              </a>
            </li>
          </ul>

          <div class="card-body about-card mb-2">
            <h5 class="card-title-center about-title">DJ Cyphers</h5>
            <p class="mt-4 card-text text-dark small job-title">
              Designer / Developer
            </p>
          </div>
        </div>
      </div>

      <div class="responsive-box col-md-6 col-lg-3">
        <div
          class="card text-white border-0 bg-transparent mt-4 about-section about-blog"
          style="cursor: pointer"
          @click="navToBlog()"
        >
          <img
            :src="placeholder"
            class="card-img-top zoom"
            alt="placeholder"
            style="filter: brightness(0%)"
          />
          <div class="card-img-overlay">
            <p class="card-typewriter-text line-1 anim-typewriter">
              My__Blog()
            </p>
            <p class="card-typewriter-text line-1 anim-typewriter">
              My__Ideas()
            </p>
            <p class="card-typewriter-text line-1 anim-typewriter">
              My__Life()
            </p>
          </div>
        </div>
      </div>

      <div class="responsive-box col-md-6 col-lg-3">
        <div class="card text-white border-0 bg-transparent mt-4 about-section">
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="flip-card-text text-center">
                  <span
                    ><i class="fa fa-user"
                      ><font-awesome-icon :icon="['fas', 'user']" /></i
                  ></span>
                  <span
                    ><i class="fa fa-heart"
                      ><font-awesome-icon :icon="['fas', 'heart']" /></i
                  ></span>
                  <span
                    ><i class="fa fa-home"
                      ><font-awesome-icon :icon="['fas', 'home']" /></i
                  ></span>
                  <span
                    ><i class="fa fa-music"
                      ><font-awesome-icon :icon="['fas', 'music']" /></i
                  ></span>
                </div>
              </div>
              <div class="flip-card-back">
                <ul class="list-group list-group-flush rounded">
                  <li
                    class="list-group-item link-soundcloud d-flex align-items-center justify-content-center"
                    @click="scUrl()"
                    style="height: 100%; font-size: 2rem"
                  >
                    &nbsp;
                    <font-awesome-icon
                      :icon="['fab', 'soundcloud']"
                    />SoundCloud
                  </li>
                  <li
                    class="list-group-item link-mixcloud d-flex align-items-center justify-content-center"
                    @click="mcUrl()"
                    style="height: 100%; font-size: 2rem"
                  >
                    &nbsp;<font-awesome-icon
                      :icon="['fab', 'mixcloud']"
                    />MixCloud
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Youtube Demo Goes Here -->
      <div class="responsive-box col-md-6 col-lg-3">
        <div class="card text-white border-0 bg-transparent mt-4 about-section">
          <YouTube
            src="https://www.youtube.com/embed/UilLkkCRCBE"
            ref="youtube"
            height="255"
            width="100%"
            origin="https://djcyphers.com"
          />
        </div>
      </div>
      <!-- Contact Form -->
      <div class="responsive-box col-md-6 col-lg-3">
        <!-- Further css inside Contact.vue -->
        <Contact></Contact>
      </div>
      <!-- Brochure Goes Here -->
      <div class="responsive-box col-md-6 col-lg-3">
        <Brochure></Brochure>
      </div>
      <!-- Discord Widget -->
      <div class="responsive-box col-md-6 col-lg-3">
        <DiscordProfile></DiscordProfile>
      </div>
      <!-- OpenAI Bot -->
      <div class="responsive-box col-md-6 col-lg-3">
        <div class="card text-white border-0 bg-black mt-4 chat-bot-wrapper">
          <h2 class="mt-3 text-center">Chat Bot</h2>
          <div @click="toggleModal()" class="robot-head-wrapper">
            <div class="glow-antenna"></div>
            <!-- SVG Code -->
            <svg class="robot" viewBox="0 0 187.41 123.05">
              <g class="robot-head">
                <rect
                  x="23.51"
                  y="35.65"
                  width="140.4"
                  height="81.9"
                  rx="40.95"
                  style="fill: #dde3f3"
                />
                <rect
                  x="23.51"
                  y="35.65"
                  width="140.4"
                  height="81.9"
                  rx="40.95"
                  style="
                    fill: none;
                    stroke: #000;
                    stroke-miterlimit: 10;
                    stroke-width: 11px;
                  "
                />
                <rect x="89.89" y="17.25" width="9.7" height="9.7" />
                <circle cx="65.15" cy="65.09" r="14.47" />
                <circle cx="124.8" cy="65.09" r="14.47" />
                <path
                  d="M93.39,103.24c-10.9,0-19.74-8.57-19.76-19.15h39.53C113.14,94.67,104.3,103.24,93.39,103.24Z"
                />
                <path
                  d="M14.61,76.56h0a40.79,40.79,0,0,1,2-12.76,8,8,0,0,0-4.9-1.8C5.26,62,0,70.77,0,81.59s5.26,19.59,11.75,19.59c3,0,5.76-1.91,7.84-5A40.86,40.86,0,0,1,14.61,76.56Z"
                />
                <path
                  d="M175.66,62a8,8,0,0,0-4.89,1.8,41.08,41.08,0,0,1,2,12.76h0a40.76,40.76,0,0,1-5,19.6c2.08,3.11,4.82,5,7.84,5,6.49,0,11.75-8.77,11.75-19.59S182.15,62,175.66,62Z"
                />
                <polygon
                  points="32.94 92.39 32.98 92.39 48.74 108.17 48.74 108.21 32.94 108.21 32.94 92.39"
                  style="fill: #dde3f3"
                />
              </g>
              <g class="antenna">
                <circle cx="94.74" cy="9.7" r="9.7" style="fill: #e11e36" />
              </g>
            </svg>
            <!-- End SVG -->
          </div>
        </div>
      </div>
    </div>
    <!-- End of Row -->
    <!-- ChatBot Modal -->
    <template v-if="isModalOpen">
      <Teleport to="body">
        <ChatBot class="chatbot-modal"></ChatBot>
      </Teleport>
    </template>
  </div>
</template>

<script>
import profilePic from "../assets/img/portfolio.jpg";
import placeholder from "../assets/img/placeholder.png";
import { ref, inject, computed, onMounted } from "vue";
import YouTube from "vue3-youtube";
import Contact from "../components/Contact.vue";
import Brochure from "../components/Brochure.vue";
import DiscordProfile from "../components/DiscordProfile.vue";
import ChatBot from "../components/ChatBot.vue";
export default {
  name: "About",
  components: { YouTube, Contact, Brochure, DiscordProfile, ChatBot },
  setup() {
    // Make sure the modal reads the value onMount
    onMounted(() => {
      isModalOpen = false;
    });

    // Inject store from store/index.js
    const store = inject("store");

    let isModalOpen = computed(() => store.state.isModalOpen);

    const toggleModal = () => {
      store.state.isModalOpen = !store.state.isModalOpen;
    };

    const scUrl = () => {
      const url = "http://soundcloud.com/djcyphers";
      window.open(url);
    };

    const mcUrl = () => {
      const url = "http://mixcloud.com/djcyphers";
      window.open(url);
    };

    const navToBlog = () => {
      document.querySelectorAll(".link")[3].click();
    };

    return {
      store,
      profilePic,
      placeholder,
      scUrl,
      mcUrl,
      navToBlog,
      toggleModal,
      isModalOpen,
    };
  },
};
</script>

<style lang="scss" scoped>
// .container {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
// }

.card-img-top {
  height: 255px;
}

.blur {
  filter: opacity(0.5) !important;
  filter: blur(20px) !important;
}

.chat-bot-wrapper {
  position: relative;
  height: 255px;
}

.chatbot-modal {
  position: fixed !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}

.glow-antenna {
  position: absolute;
  animation: anim-glow-online 2s ease infinite;
  border-radius: 50%;
  height: 4px;
  width: 4px;
  left: 0;
  right: 0;
  margin-top: 29px;
  margin-left: auto;
  margin-right: auto;
}

@keyframes anim-glow-online {
  0% {
    box-shadow: 0 0 0 8px rgba(#ca0b1b, 1);
  }

  100% {
    box-shadow: 0 0 10px 10px transparent;
    border-width: 5px;
  }
}

.robot-head-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: 80px;
  height: 140px;
  width: 140px;
  background-color: #ffffff;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}

.robot {
  position: relative;
  width: 120px;
  /* Need a specific value to work */
  height: 130px;
}

/* About Me */
$background-color_1: #000;

.about-wrapper {
  position: relative;
  top: 52%;
  left: 50%;
  width: 100%;
  height: 255px;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  border: rgb(0, 0, 0) !important;
  overflow: hidden;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;

  &:hover {
    img {
      opacity: 0.4;
      -webkit-transition: 0.5s;
      -moz-transition: 0.5s;
      -o-transition: 0.5s;
      transition: 0.5s;
    }

    .about-image {
      -webkit-transform: translateY(-80px);
      -moz-transform: translateY(-80px);
      -o-transform: translateY(-80px);
      transform: translateY(-80px);
      -webkit-transition: all 0.9s;
      -moz-transition: all 0.9s;
      -o-transition: all 0.9s;
      transition: all 0.9s;
    }
  }
}

.about-image {
  position: absolute;
  object-fit: scale-down;
  top: 0px;
  left: 0px;
  height: 255px;
  z-index: 2;
  background-color: $background-color_1;
  -webkit-transition: 0.5s;
  -moz-transition: 0.5s;
  -o-transition: 0.5s;
  transition: 0.5s;
}

/**** Personal Details ****/

.about-card {
  position: absolute;
  bottom: -54px;
  left: 0;
  background: #fff;
  width: 100%;
  height: 120px;
  z-index: 1;
  padding: 10px;
}

.job-title {
  font-size: 1rem;
  line-height: 0rem;
  color: #333;
  font-weight: 300;
}

.about-title {
  font-size: calc(1vw + 1rem);
  line-height: 0rem;
  color: rgb(23, 23, 23);
  font-weight: 300;
  font-family: Dosis;
  margin-bottom: 30px;
}

/**** Social Icons *****/

.socialshare-icons {
  scale: 0.9;
  position: relative;
  top: 50%;
  z-index: 3;
  display: flex;
  padding-left: 0em;
}

ul.socialshare-icons li {
  list-style: none;
}

ul.socialshare-icons a {
  position: relative;
  display: block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #fff;
  font-size: 23px;
  color: #333;
  font-weight: bold;
  margin: 0 6px;
  -webkit-transition: 0.4s;
  -moz-transition: 0.4s;
  -o-transition: 0.4s;
  transition: 0.4s;
  -webkit-transform: translateY(200px);
  -moz-transform: translateY(200px);
  -o-transform: translateY(200px);
  transform: translateY(200px);
  opacity: 0;
}

.about-wrapper:hover .socialshare-icons li a {
  -webkit-transform: translateY(0px);
  -moz-transform: translateY(0px);
  -o-transform: translateY(0px);
  transform: translateY(0px);
  opacity: 1;
}

.socialshare-icons li a:hover {
  background: #000;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

ul.socialshare-icons i.fa {
  color: #000;
}

.socialshare-icons li a .fa {
  -webkit-transition: 0.8s;
  -moz-transition: 0.8s;
  -o-transition: 0.8s;
  transition: 0.8s;
}

.socialshare-icons li a:hover {
  color: #fff;
}

.socialshare-icons li a svg:hover {
  animation: rotate-icon 1s linear infinite;
  transform-box: fill-box;
  transform-origin: center;
  color: #fff;
}

@keyframes rotate-icon {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
}

.about-wrapper:hover li:nth-child(1) a {
  -webkit-transition-delay: 0.1s;
  -moz-transition-delay: 0.1s;
  -o-transition-delay: 0.1s;
  transition-delay: 0.1s;
}

.about-wrapper:hover li:nth-child(2) a {
  -webkit-transition-delay: 0.2s;
  -moz-transition-delay: 0.2s;
  -o-transition-delay: 0.2s;
  transition-delay: 0.2s;
}

.about-wrapper:hover li:nth-child(3) a {
  -webkit-transition-delay: 0.3s;
  -moz-transition-delay: 0.3s;
  -o-transition-delay: 0.3s;
  transition-delay: 0.3s;
}

.about-wrapper:hover li:nth-child(4) a {
  -webkit-transition-delay: 0.4s;
  -moz-transition-delay: 0.4s;
  -o-transition-delay: 0.4s;
  transition-delay: 0.4s;
}
</style>
