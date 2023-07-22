<template>
  <div id="chatContainer">
    <div class="chat-title">
      <h1>
        Cyphers Bot
        <font-awesome-icon
          @click="store.state.isModalOpen = false"
          class="close-button"
          :icon="['fa', 'times-circle']"
        />
      </h1>
      <h2>Virtual Assistant</h2>

      <figure class="avatar">
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
      </figure>
    </div>
    <div class="messages">
      <div class="messages-content">
        <template v-for="message in messages" :key="message.id">
          <div class="message message-personal new" v-if="message.id % 2 == 0">
            {{ message.message }}
          </div>
          <div class="message new" v-else>
            <figure class="avatar">
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
            </figure>
            {{ message.message }}
          </div>
        </template>
        <div v-if="isLoading" class="message loading new"></div>
      </div>
    </div>
    <div class="message-box">
      <textarea
        @keyup.enter.native="sendMessage()"
        type="text"
        v-model="messageContent"
        class="message-input"
        placeholder="Type message..."
      ></textarea>
      <button
        @click.prevent="sendMessage()"
        type="submit"
        class="message-submit"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, inject } from "vue";
import swal from "sweetalert";
export default {
  name: "ChatBot",
  setup() {
    const store = inject("store");
    const messages = ref([]);
    const messageContent = ref("");
    const isLoading = ref(false);

    //Sends the message on form submit
    function sendMessage() {
      if (messageContent.value == "") return;
      createMessage(messageContent.value);
      getResponse(messageContent.value);
      messageContent.value = "";
    }
    //Create a message
    function createMessage(message) {
      let id = 0;
      if (messages.value[messages.value.length - 1]) {
        id = messages.value[messages.value.length - 1].id + 1;
      }
      messages.value.push({
        id: id,
        message: message,
      });
    }

    async function getResponse(message) {
      isLoading.value = true;
      const postData = {
        message: message,
      };

      let response = await axios.post("openai/chat", postData);

      if (Object.keys(response.data.message).length > 0) {
        isLoading.value = false;
        createMessage(response.data.message);
      } else {
        swal("Error", "Uh, Oh! Something bad happened!", "error");
      }
    }

    return {
      messages,
      messageContent,
      sendMessage,
      isLoading,
      store,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@mixin ball {
  @include center;
  content: "";
  display: block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  z-index: 9;
  margin-top: 4px;
  animation: ball 0.45s cubic-bezier(0, 0, 0.15, 1) alternate infinite;
}

#chatContainer {
  width: calc(300px + 20vw);
  height: 80vh;
  max-height: 500px;
  z-index: 9;
  overflow: hidden;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.chat-title {
  flex: 0 1 45px;
  position: relative;
  z-index: 2;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  text-transform: uppercase;
  text-align: left;
  padding: 10px 10px 10px 50px;

  h1,
  h2 {
    font-weight: normal;
    font-size: 10px;
    margin: 0;
    padding: 0;
  }

  h2 {
    color: rgba(255, 255, 255, 0.5);
    font-size: 8px;
    letter-spacing: 1px;
  }

  .close-button {
    display: inline;
    float: right;
  }

  .avatar {
    background-color: white;
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 9px;
    border-radius: 30px;
    width: 30px;
    height: 30px;
    overflow: hidden;
    margin: 0;
    padding: 0;
    border: 2px solid rgba(255, 255, 255, 0.24);
    .robot {
      width: 100%;
      height: auto;
    }
  }
}

/*--------------------
Messages
--------------------*/
.messages {
  flex: 1 1 auto;
  color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
  position: relative;
  width: 99%;

  & .messages-content {
    position: absolute;
    overflow-y: scroll;
    top: 0;
    left: 0;
    height: 101%;
    width: 100%;
  }

  .message {
    clear: both;
    float: left;
    padding: 6px 10px 7px;
    border-radius: 10px 10px 10px 0;
    background: rgba(27, 27, 27, 0.3);
    margin: 8px 0;
    font-size: 11px;
    line-height: 1.4;
    margin-left: 35px;
    position: relative;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);

    .timestamp {
      position: absolute;
      bottom: -15px;
      font-size: 9px;
      color: rgba(255, 255, 255, 0.3);
    }

    &::before {
      content: "";
      position: absolute;
      bottom: -6px;
      border-top: 6px solid rgba(0, 0, 0, 0.3);
      left: 0;
      border-right: 7px solid transparent;
    }

    .avatar {
      background-color: white;
      position: absolute;
      z-index: 1;
      bottom: -10px;
      left: -28px;
      border-radius: 30px;
      width: 30px;
      height: 30px;
      overflow: hidden;
      margin: 0;
      padding-top: 2px;
      border: 2px solid rgba(255, 255, 255, 0.24);

      .robot {
        width: 100%;
        height: auto;
      }
    }

    &.message-personal {
      float: right;
      color: #fff;
      text-align: right;
      background: linear-gradient(120deg, #248a52, #257287);
      border-radius: 10px 10px 0 10px;
      margin-right: 2px;

      &::before {
        left: auto;
        right: 0;
        border-right: none;
        border-left: 5px solid transparent;
        border-top: 4px solid #257287;
        bottom: -4px;
      }
    }

    &:last-child {
      margin-bottom: 30px;
    }

    &.new {
      transform: scale(0);
      transform-origin: 0 0;
      animation: bounce 500ms linear both;
    }

    &.loading {
      &::before {
        @include ball;
        border: none;
        animation-delay: 0.15s;
      }

      & span {
        display: block;
        font-size: 0;
        width: 20px;
        height: 10px;
        position: relative;

        &::before {
          @include ball;
          margin-left: -7px;
        }

        &::after {
          @include ball;
          margin-left: 7px;
          animation-delay: 0.3s;
        }
      }
    }
  }
}

/*--------------------
Message Box
--------------------*/
.message-box {
  flex: 0 1 40px;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  position: relative;

  & .message-input {
    background: none;
    border: none;
    outline: none !important;
    resize: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 11px;
    height: 17px;
    margin: 0;
    padding-right: 20px;
    width: 265px;
  }

  textarea:focus:-webkit-placeholder {
    color: transparent;
  }

  & .message-submit {
    position: absolute;
    z-index: 1;
    top: 9px;
    right: 10px;
    color: #fff;
    border: none;
    background: #248a52;
    font-size: 10px;
    text-transform: uppercase;
    line-height: 1;
    padding: 6px 10px;
    border-radius: 10px;
    outline: none !important;
    transition: background 0.2s ease;

    &:hover {
      background: #1d7745;
    }
  }
}

/*--------------------
Bounce
--------------------*/
@keyframes bounce {
  0% {
    transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  4.7% {
    transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  9.41% {
    transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  14.11% {
    transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  18.72% {
    transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  24.32% {
    transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  29.93% {
    transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  35.54% {
    transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  41.04% {
    transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  52.15% {
    transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  63.26% {
    transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  85.49% {
    transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  100% {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
}

@keyframes ball {
  from {
    transform: translateY(0) scaleY(0.8);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
