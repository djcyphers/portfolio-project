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
    style="width: 180px"
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
    <div class="loggedin" v-if="store.state.logged === true">
      <LoggedIn></LoggedIn>
    </div>
    <div class="register-user" v-else-if="store.state.register === true">
      <Register></Register>
    </div>
    <div class="loggedout" v-else>
      <Login></Login>
    </div>
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
//import axios from "axios";

export default {
  name: "Admin",
  components: {
    LoggedIn,
    Login,
    Register,
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
    return {
      store,
      resetLogin,
    };
  },
  data() {
    return {
      avatar,
    };
  },
  methods: {
    openPanel: () => {
      const adminPanel = document.getElementById("admin-panel");
      const avatarLogin = document.getElementById("avatar-login");
      adminPanel.classList.remove("d-none");
      adminPanel.classList.remove("animate__backOutRight");
      avatarLogin.classList.remove("animate__backInRight");
      adminPanel.classList.add("animate__backInRight");
      avatarLogin.classList.add("animate__backOutRight");
    },
    closePanel: () => {
      const adminPanel = document.getElementById("admin-panel");
      const avatarLogin = document.getElementById("avatar-login");
      adminPanel.classList.remove("animate__backInRight");
      avatarLogin.classList.remove("animate__backOutRight");
      adminPanel.classList.add("animate__backOutRight");
      avatarLogin.classList.add("animate__backInRight");
    },
  },
};
</script>
