<template>
  <ul class="list-group scrollarea">
    <li class="list-group-item lg-user">Name : {{ user.userName }}</li>
    <li class="list-group-item lg-user">Email : {{ user.email }}</li>
    <li class="list-group-item lg-user">Points : {{ user.points }}</li>
    <li class="list-group-item lg-user">Ref Code : {{ user.referralCode }}</li>
    <li class="list-group-item lg-user">Blog Posts Count</li>
    <button class="list-group-item lg-user" @click="changePassword()">Change Password</button>
  </ul>
  <button
    class="btn btn-primary btn-block w-40 my-2 center"
    @click="
      backButton();
      getAdminPanel();
    "
  >
    Go Back
  </button>
</template>

<script>
import { ref, inject, computed, onMounted } from "vue";
import axios from "axios";

export default {
  name: "Profile",
  setup() {
    const store = inject("store");
    const user = ref({
      userName: "",
      email: "",
      referralCode: "",
      points: 0,
    });

    const backButton = computed({
      get() {
        return store.methods.exitProfile;
      },
      set() {
        return store.methods.exitProfile;
      },
    });

    const getAdminPanel = computed({
      get() {
        return store.methods.logIn;
      },
      set() {
        return store.methods.logIn;
      },
    });
    
    onMounted(async () => {
      axios
        .get("/user/profile", {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        })
        .then((res) => {
          if (res.data.success) {
            user.value.userName = res.data.userName;
            user.value.email = res.data.email;
            user.value.referralCode = res.data.referralCode;
            user.value.points = res.data.points;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });

    function changePassword() {
      store.state.profile = false;
      store.state.resetPassword = true;
    }
    return {
      user,
      backButton,
      getAdminPanel,
      changePassword,
    };
  },
};
</script>

<style lang="scss" scoped>
.lg-user {
  background-color: rgba($color: #000000, $alpha: 0.4);
  color: white;
}
</style>
