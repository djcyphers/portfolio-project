<template>
  <form
    class="text-center"
    style="margin-top: 10px; height: auto"
    @submit.prevent="registerUser"
  >
    <input
      type="text"
      id="name"
      class="form-control mb-3"
      placeholder="Name"
      v-model="register.name"
      required
    />
    <input
      type="email"
      id="email"
      class="form-control mb-3"
      placeholder="Email"
      v-model="register.email"
      required
    />

    <!-- Password -->
    <input
      type="password"
      id="password"
      class="form-control mb-3"
      placeholder="Password"
      v-model="register.password"
    />
    <p>
      Already have an account? <a href="#" @click="resetLogin">click here</a>

      <!-- Sign in button -->
      <button class="btn btn-primary btn-block w-75 my-1" type="submit">
        Register
      </button>
    </p>
  </form>
</template>

<script>
import { inject, computed } from "vue";
import swal from "sweetalert";
export default {
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
      register: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async registerUser() {
      try {
        let response = await this.axios.post("/user/register", this.register);
        console.log(response);
        let token = response.data.token;
        if (token) {
          localStorage.setItem("jwt", token);
          this.$router.push("/");
          swal("Success", "Registration Was successful", "success");
        } else {
          swal("Error", "Something Went Wrong", "error");
        }
      } catch (err) {
        let error = err.response;
        if (error.status == 409) {
          swal("Error", error.data.message, "error");
        } else {
          swal("Error", error.data.err.message, "error");
        }
      }
    },
  },
};
</script>
