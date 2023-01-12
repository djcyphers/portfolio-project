<template>
  <div class="container">
    <div id="about-section" class="row">
      <div class="responsive-box col-md-6 col-lg-3">
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
            <p class="mt-4 card-text text-dark small job-title">Designer / Developer</p>
          </div>
        </div>
      </div>

      <div class="responsive-box col-md-6 col-lg-3">
        <div
          class="
            card
            text-white
            border-0
            bg-transparent
            mt-4
            about-section about-blog
          "
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
            <p class="card-text line-1 anim-typewriter">My__Blog()</p>
            <p class="card-text line-1 anim-typewriter">My__Ideas()</p>
            <p class="card-text line-1 anim-typewriter">My__Life()</p>
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
                    class="
                      list-group-item
                      link-soundcloud
                      d-flex
                      align-items-center
                      justify-content-center
                    "
                    @click="scUrl()"
                    style="height: 100%; font-size: 2rem;"
                  >
                    &nbsp; <font-awesome-icon :icon="['fab', 'soundcloud']" />SoundCloud
                  </li>
                  <li
                    class="
                      list-group-item
                      link-mixcloud
                      d-flex
                      align-items-center
                      justify-content-center
                    "
                    @click="mcUrl()"
                    style="height: 100%; font-size: 2rem;"
                  >
                    &nbsp;<font-awesome-icon :icon="['fab', 'mixcloud']" />MixCloud
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
            src="https://www.youtube.com/embed/RoNNJ_nPWY0"
            @ready="onReady"
            ref="youtube"
            height="255"
            width="100%"
            origin="http://localhost:8080"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import profilePic from "../assets/img/portfolio.jpg";
import placeholder from "../assets/img/placeholder.png";
import { defineComponent } from "vue";
import YouTube from "vue3-youtube";

export default defineComponent({
  name: "About",
  components: { YouTube },
  data() {
    return {
      profilePic,
      placeholder,
    };
  },

  methods: {
    scUrl: () => {
      const url = "http://soundcloud.com/djcyphers";
      window.open(url);
    },
    mcUrl: () => {
      const url = "http://mixcloud.com/djcyphers";
      window.open(url);
    },
    navToBlog: () => {
      document.querySelectorAll(".link")[3].click();
    },
    onReady() {
      this.$refs.youtube.mute();
      this.$refs.youtube.playVideo();
    },
  },
});
</script>
