<template>
  <span class="fs-4 text-center">Account Login</span>
  <form
    class="text-center"
    style="margin-top: 10px; height: auto"
    @submit.prevent="loginUser"
  >
    <input
      type="text"
      id="email"
      class="form-control mb-3"
      placeholder="Email"
      v-model="login.email"
      required
    />

    <!-- Password -->
    <input
      type="password"
      id="password"
      class="form-control mb-3"
      placeholder="Password"
      autocomplete="on"
      v-model="login.password"
      required
    />
    <!-- Sign in button -->
    <button class="btn btn-primary btn-block w-75 my-3" type="submit">
      Login
    </button>
    <!-- Register button -->
    <template v-if="loginState.loginReset === true">
      <div class="fs-6 text-center">Reset your password</div>
      <button
        class="btn btn-primary btn-block w-75 my-3"
        type="button"
        @click="forgotPassword"
      >
        Forgot Password
      </button>
    </template>
    <template v-if="loginState.loginReset === false">
      <p>Sorry! Registration Disabled</p>
      <!-- @click="registerUser" -->
      <button class="btn btn-primary btn-block w-75 register-button">
        Register
      </button>
    </template>
  </form>
</template>

<script>
import { ref, inject, computed } from "vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  name: "Login",
  setup() {
    let login = ref({
      email: "",
      password: "",
    });
    let accessToken = ref("");
    let loginState = ref({
      count: 0,
      loginReset: false,
    });
    const store = inject("store");
    const registerUser = computed({
      get() {
        return store.methods.register;
      },
      set() {
        return store.methods.register;
      },
    });
    const logUserStatus = computed({
      get() {
        return store.methods.logIn;
      },
      set() {
        return store.methods.logIn;
      },
    });
    const verifyUser = computed({
      get() {
        return store.methods.activateUser;
      },
      set() {
        return store.methods.activateUser;
      },
    });
    const resetPassword = computed({
      get() {
        return store.methods.resetPassword;
      },
      set() {
        return store.methods.resetPassword;
      },
    });
    async function loginUser() {
      await axios
        .post("user/login", login.value)
        .then((res) => {
          if (res.data.success) {
            swal("Success", res.data.message, "success");
            logUserStatus.value();
            store.state.accessToken = res.data.accessToken;
          }
        })
        .catch(function(error) {
          swal("Error", error.response.data.message, "error");
          if (error.response) {
            // Go to verify screen if user is not activated
            if (loginState.value.count > 1) {
              loginState.value.loginReset = true;
              loginState.value.count = 0;
            } else if (loginState.value.count <= 1) {
              loginState.value.count++;
              loginState.value.loginReset = false;
            }
            if (error.response.data.id === "invalid") {
              swal("Error", error.response.data.message, "error");
              // console.log(error.response.data);
            }
            if (error.response.data.id === "verify") {
              swal("Error", error.response.data.message, "error");
              verifyUser.value();
            }
          }
        });
    }
    // Async function for forget password method
    async function forgotPassword() {
      await axios
        .patch("user/forgot", { email: login.value.email })
        .then((res) => {
          if (res.data.success) {
            resetPassword.value();
            swal("Success", res.data.message, "success");
          }
        })
        .catch((error) => {
          if (error.response) {
            swal("Error", error.response.data.message, "error");
          }
        });
    }
    return {
      store,
      registerUser,
      logUserStatus,
      login,
      loginUser,
      verifyUser,
      accessToken,
      loginState,
      forgotPassword,
      resetPassword,
    };
  },
};
</script>

<style lang="scss" scoped>

.register-button {
  text-decoration: line-through;
}

</style>
