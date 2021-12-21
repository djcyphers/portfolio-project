<template>
  <span class="fs-4 text-center">Account Registration</span>
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
      v-model="register.userName"
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
      autocomplete="on"
      v-model="register.password"
    />
    <p>
      <input
        type="password"
        id="confirm-password"
        class="form-control mb-3"
        placeholder="Confirm"
        autocomplete="on"
        v-model="register.confirmPassword"
      />
    </p>
    <p>
      <input
        type="text"
        id="referral"
        class="form-control mb-3"
        placeholder="Refferal"
        autocomplete="off"
        v-model="register.refferer"
      />
    </p>

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
import { ref, inject, computed } from "vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  setup() {
    const store = inject("store");
    let register = ref({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      referrer: "",
    });
    const resetLogin = computed({
      get() {
        return store.methods.cancelRegister;
      },
      set() {
        return store.methods.cancelRegister;
      },
    });
    const activateUser = computed({
      get() {
        return store.methods.activateUser;
      },
      set() {
        return store.methods.activateUser;
      },
    });
    async function registerUser() {
      try {
        let response = await axios.post("user/register", register.value);
        if (response.data.success) {
          // Trigger the activation email view
          activateUser.value();
          resetLogin.value();
          swal("Success", "Registration Successful", "success");
        } else if (response.data.error) {
          swal("Error", response.data.message, "error");
        }
      } catch (error) {
        // Catch error status 409 and response error message
        swal("Error", error, "error");
      }
    }
    return {
      store,
      registerUser,
      resetLogin,
      activateUser,
      register,
    };
  },
};
</script>
