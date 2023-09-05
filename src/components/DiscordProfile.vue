<template>
  <div class="card text-white bg-black mb-3 border-0 mt-4 about-section">
    <h2 class="mt-3 text-white text-center">Discord</h2>
    <div class="discord-card">
      <div
        class="discord-avatar"
        :class="{ online: userOnline, offline: !userOnline }"
      >
        <img :src="myProfile.avatarUrl" />
      </div>
      <div class="discord-userinfo">
        <h4>{{ myProfile.username }}</h4>
        <div class="discord-userstatus">
          <p>Status: {{ myProfile.status }}</p>
        </div>
        <div class="discord-useractivity mt-2">
          <h5>Current Activity</h5>
          <p>{{ myProfile.game }}</p>
        </div>
      </div>
    </div>
    <a href="https://discord.gg/TF2Vj5nJ9G" class="server-button" role="button">
      <p>Join Server</p>
    </a>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import swal from "sweetalert";

export default {
  name: "DiscordProfile",
  setup() {
    onMounted(() => {
      getProfile();
    });

    const myProfile = ref({
      username: "",
      status: "",
      game: "",
      avatarUrl: "",
    });

    const userOnline = ref(false);

    async function getProfile() {
      try {
        let response = await axios.get(
          "https://discord.com/api/guilds/1074230583607164958/widget.json"
        );
        if (response.status === 200) {
          const data = response.data;
          myProfile.value.username = "djcyphers";
          myProfile.value.status =
            data.members[0].status.charAt(0).toUpperCase() +
            data.members[0].status.slice(1);
          if (Object.keys(data.members[0]).length > 6) {
            myProfile.value.game = data.members[0].game.name;
          } else {
            myProfile.value.game = "AFK";
          }
          myProfile.value.avatarUrl = data.members[0].avatar_url;
          if (myProfile.value.status === "Online") {
            userOnline.value = true;
          } else {
            userOnline.value = false;
          }
        }
      } catch (error) {
        // if (error.response.status === 500) {
        //   swal("Error", error.response.data.message, "error");
        // }
        console.log(error);
      }
    }
    return {
      myProfile,
      getProfile,
      userOnline,
    };
  },
};
</script>

<style lang="scss" scoped>
h2 {
  z-index: 1;
}

.discord-card {
  position: relative;
  width: auto;
  height: 195px;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  background-color: black;
  display: flex;
}

.discord-avatar img {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  margin-left: 38px;
  margin-right: 10px;
  margin-top: 25px;
}

.online img {
  animation: anim-glow-online 2s ease infinite;
}

@keyframes anim-glow-online {
  0% {
    box-shadow: 0 0 0 2px rgba(#61ef61, 1);
  }
  100% {
    box-shadow: 0 0 8px 8px transparent;
    border-width: 2px;
  }
}

.offline img {
  animation: anim-glow-offline 2s ease infinite;
}

@keyframes anim-glow-offline {
  0% {
    box-shadow: 0 0 0 2px rgba(#c91a37, 1);
  }
  100% {
    box-shadow: 0 0 8px 8px transparent;
    border-width: 2px;
  }
}

.discord-userinfo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2.5rem;
  margin-top: 1.5rem;
  transform: translateY(-50%, -50%);
}

.discord-userinfo h2 {
  margin-bottom: 0;
  font-size: 1.5rem;
}

.discord-userstatus {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.discord-userstatus p {
  margin: 0;
  font-size: 0.8rem;
}

.discord-userstatus p:first-of-type::before {
  content: "•";
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: #43b581;
}

.discord-useractivity {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.discord-useractivity p {
  margin: 0;
  font-size: 0.8rem;
}

.discord-useractivity p:first-of-type::before {
  content: "•";
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: #43b581;
}

/* Button */
.server-button {
  position: absolute;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 14px;
  max-width: 150px;
  height: 20px;
  padding: 19px 24px;
  cursor: pointer;
  appearance: button;
  text-decoration: none;
  transform: translate(83%, 500%);
}

.server-button p {
  margin-top: -10px;
  font-family: Dosis;
}

.server-button:hover {
  box-shadow: 0 0 0 2px rgb(255, 255, 255);
}
</style>
