<template>
  <div
    class="
      d-flex
      flex-column flex-shrink-0
      p-3
      text-white
      admin-panel
      d-none
      animate__animated
    "
    id="admin-panel"
    style="width: 180px; z-index: 5"
  >
    <a
      href="#"
      @click="
        closePanel();
        resetLogin();
      "
      class="
        d-flex
        align-items-center
        mb-3 mb-md-0
        me-md-auto
        text-white text-decoration-none
      "
    >
      <img class="bi me-2" width="32" height="32" :src="avatar" />
      <span class="fs-4 text-center">Admin Panel</span>
    </a>
    <hr />
    <!-- Check if logged in else provide login element instead -->
    <LoggedIn v-if="store.state.logged === true" />
    <Register v-else-if="store.state.register === true" />
    <Profile v-else-if="store.state.profile === true" />
    <VerifyEmail v-else-if="store.state.activateUser === true" />
    <Login v-else />
  </div>
  <div
    class="avatar-login animate__animated"
    id="avatar-login"
    @click="openPanel"
  >
    <img class="bi me-2" width="64" height="64" :src="avatar" />
  </div>
</template>

<script>
import avatar from "../../assets/img/avatar.png";
import { inject, computed } from "vue";
import LoggedIn from "./LoggedIn";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import VerifyEmail from "./VerifyEmail";
//import axios from "axios";

export default {
  name: "Admin",
  components: {
    LoggedIn,
    Login,
    Register,
    Profile,
    VerifyEmail,
  },
  setup() {
    const store = inject("store");
    const resetLogin = computed({
      get() {
        return store.methods.cancelRegister;
      },
      set() {
        return store.methods.cancelRegister;
      },
    });
    function openPanel() {
      const adminPanel = document.getElementById("admin-panel");
      const avatarLogin = document.getElementById("avatar-login");
      adminPanel.classList.remove("d-none");
      adminPanel.classList.remove("animate__backOutRight");
      avatarLogin.classList.remove("animate__backInRight");
      adminPanel.classList.add("animate__backInRight");
      avatarLogin.classList.add("animate__backOutRight");
    }
    function closePanel() {
      const adminPanel = document.getElementById("admin-panel");
      const avatarLogin = document.getElementById("avatar-login");
      adminPanel.classList.remove("animate__backInRight");
      avatarLogin.classList.remove("animate__backOutRight");
      adminPanel.classList.add("animate__backOutRight");
      avatarLogin.classList.add("animate__backInRight");
    }
    return {
      store,
      resetLogin,
      avatar,
      openPanel,
      closePanel,
    };
  },
};
</script>
