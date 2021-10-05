<template>
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
      v-model="login.password"
      required
    />
    <!-- Sign in button -->
    <button class="btn btn-primary btn-block w-75 my-3" type="submit">
      Sign in
    </button>

    <p>Don't have an account?</p>
    <button class="btn btn-primary btn-block w-75" @click="registerUser">
      Register
    </button>
  </form>
</template>

<script>
import { inject, computed } from "vue";
import swal from "sweetalert";
export default {
  name: "Login",
  setup() {
    const store = inject("store");
    const registerUser = computed({
      get() {
        return store.methods.register;
      },
      set() {
        return store.methods.register;
      },
    });
    return {
      store,
      registerUser,
    };
  },
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async loginUser() {
      try {
        let response = await this.$http.post("/user/login", this.login);
        let token = response.data.token;
        localStorage.setItem("jwt", token);
        if (token) {
          swal("Success", "Login Successful", "Error");
          this.$router.push("/");
        }
      } catch (err) {
        swal("Error", "Something Went Wrong", "error");
        console.log(err.response);
      }
    },
  },
};
</script>
