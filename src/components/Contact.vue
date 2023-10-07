<template>
  <div
    :class="{ flipped: isFlipped }"
    class="card text-white bg-black mb-3 border-0 mt-4 about-section"
  >
    <Teleport to="html">
      <Transition name="fade">
        <template v-if="isFlipped">
          <VueRecaptcha
            class="vue-recaptcha"
            :sitekey="siteKey"
            :load-recaptcha-script="true"
            @verify="handleSuccess"
            @error="handleError"
          >
          </VueRecaptcha>
        </template>
      </Transition>
    </Teleport>
    <div @click.prevent="flipCard" class="card-face card-front">
      <h2 class="mt-3">Contact Me</h2>
      <div class="letter-image mt-4">
        <div class="animated-mail">
          <div class="back-fold"></div>
          <div class="letter">
            <div class="letter-border"></div>
            <div class="letter-title"></div>
            <div class="letter-context"></div>
            <div class="letter-stamp">
              <div class="letter-stamp-inner"></div>
            </div>
          </div>
          <div class="top-fold"></div>
          <div class="letter-body"></div>
          <div class="left-fold"></div>
        </div>
      </div>
    </div>
    <div class="card-back">
      <div class="card-header">
        Contact Form | Email:
        <a
          class="email"
          href="&#109;ai&#108;&#116;o&#58;%64j&#64;&#37;&#54;4%&#54;Ac&#121;&#112;h&#101;rs&#46;com"
          >d&#106;&#64;d&#106;c&#121;phers&#46;com</a
        >
      </div>
      <div class="card-body">
        <form
          class="text-center"
          style="margin-top: 10px; height: auto"
          @submit.prevent="submitForm"
        >
          <input
            class="form-control mb-3"
            placeholder="Name"
            v-model="contactForm.name"
            autocomplete="on"
            required
          />
          <input
            class="form-control mb-3"
            placeholder="Email"
            v-model="contactForm.email"
            autocomplete="on"
            required
          />
          <input
            class="form-control mb-3"
            placeholder="Subject"
            v-model="contactForm.subject"
            required
          />
          <textarea
            class="form-control mb-3"
            v-model="contactForm.msg"
            placeholder="Message"
          ></textarea>
          <button class="btn btn-secondary btn-block w-75 my-1" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { VueRecaptcha } from "vue-recaptcha";
import axios from "axios";
import swal from "sweetalert";

const isRobot = ref(true);
// Toggle for flipping the contact card
const isFlipped = ref(false);

const siteKey = computed(() => {
  return process.env.VUE_APP_RECAPTCHA_KEY;
});

const contactForm = ref({
  name: "",
  email: "",
  subject: "",
  msg: "",
});

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

const handleSuccess = () => {
  isRobot.value = false;
};

const handleError = () => {
  if (location.hostname == "localhost") {
    isRobot.value = false;
  } else {
    isRobot.value = true;
    swal("Error", "What are you? A robot?", "error");
  }
};

async function submitForm() {
  if (isRobot) {
    return swal("Error", "Please complete captcha!", "error");
  }
  try {
    let response = await axios.post("user/contact", contactForm.value);
    if (response.status === 200) {
      swal("Success", "Message Sent!", "success");
    }
  } catch (error) {
    if (error.response.status === 500) {
      swal("Error", error.response.data.message, "error");
    }
    console.log(error);
  }
}
</script>
<style lang="scss" scoped>
.card {
  position: relative;
  width: 100%;
  height: 255px;
  cursor: pointer;
  transform-style: preserve-3d;
  transform-origin: center right;
  transition: transform 1s;
}

.card.flipped {
  transform: translateX(-100%) rotateY(-180deg);
}
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 260px;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 40px;
}
.card-front {
  background: black;
  backface-visibility: hidden;
}
.card-back {
  backface-visibility: hidden;
  background: black;
  transform: rotateY(180deg);
}

// Envelope for Contact
.letter-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.animated-mail {
  position: absolute;
  height: 150px;
  width: 200px;
  -webkit-transition: 0.4s;
  -moz-transition: 0.4s;
  transition: 0.4s;

  .letter-body {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 100px 200px;
    border-color: transparent transparent #e95f55 transparent;
    z-index: 2;
  }

  .top-fold {
    position: absolute;
    top: 50px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 50px 100px 0 100px;
    -webkit-transform-origin: 50% 0%;
    -webkit-transition: transform 0.4s 0.4s, z-index 0.2s 0.4s;
    -moz-transform-origin: 50% 0%;
    -moz-transition: transform 0.4s 0.4s, z-index 0.2s 0.4s;
    transform-origin: 50% 0%;
    transition: transform 0.4s 0.4s, z-index 0.2s 0.4s;
    border-color: #cf4a43 transparent transparent transparent;
    z-index: 2;
  }

  .back-fold {
    position: absolute;
    bottom: 0;
    width: 200px;
    height: 100px;
    background: #cf4a43;
    z-index: 0;
  }

  .left-fold {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 50px 0 50px 100px;
    border-color: transparent transparent transparent #e15349;
    z-index: 2;
  }

  .letter {
    left: 20px;
    bottom: 0px;
    position: absolute;
    width: 160px;
    height: 60px;
    background: white;
    z-index: 1;
    overflow: hidden;
    -webkit-transition: 0.4s 0.2s;
    -moz-transition: 0.4s 0.2s;
    transition: 0.4s 0.2s;

    .letter-border {
      height: 10px;
      width: 100%;
      background: repeating-linear-gradient(
        -45deg,
        #cb5a5e,
        #cb5a5e 8px,
        transparent 8px,
        transparent 18px
      );
    }

    .letter-title {
      margin-top: 10px;
      margin-left: 5px;
      height: 10px;
      width: 40%;
      background: #cb5a5e;
    }
    .letter-context {
      margin-top: 10px;
      margin-left: 5px;
      height: 10px;
      width: 20%;
      background: #cb5a5e;
    }

    .letter-stamp {
      margin-top: 30px;
      margin-left: 120px;
      border-radius: 100%;
      height: 30px;
      width: 30px;
      background: #cb5a5e;
      opacity: 0.3;
    }
  }
}

.letter-image:hover {
  .animated-mail {
    transform: translateY(50px);
    -webkit-transform: translateY(50px);
    -moz-transform: translateY(50px);
  }

  .animated-mail .top-fold {
    transition: transform 0.4s, z-index 0.2s;
    transform: rotateX(180deg);
    -webkit-transition: transform 0.4s, z-index 0.2s;
    -webkit-transform: rotateX(180deg);
    -moz-transition: transform 0.4s, z-index 0.2s;
    -moz-transform: rotateX(180deg);
    z-index: 0;
  }

  .animated-mail .letter {
    height: 180px;
  }

  .shadow {
    width: 250px;
  }
}

.email {
  text-decoration: none;
  color: white;
}

.vue-recaptcha {
  z-index: 12;
  position: fixed;
  bottom: 0;
  right: 0;
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
