<template>
  <form
    class="text-center"
    style="margin-top: 10px; height: auto"
    @submit.prevent="resetPassword"
  >
    <input
      type="text"
      id="code"
      class="form-control mb-3"
      placeholder="Verify Code"
      v-model="register.code"
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
        placeholder="Verify Password"
        autocomplete="on"
        v-model="register.confirmPassword"
      />
    </p>
    <p>
      <!-- Reset password -->
      <button class="btn btn-primary btn-block w-75 my-1" type="submit">
        Reset Password
      </button>
    </p>
  </form>
</template>

<script>
import { ref, inject, computed } from "vue";
import axios from "axios";
import swal from "sweetalert";
export default {
  name: "ResetPassword",
  setup() {
    const store = inject("store");
    let register = ref({
      code: "",
      password: "",
      confirmPassword: "",
    });
    const resetSuccess = computed({
      get() {
        return store.methods.reset;
      },
      set() {
        return store.methods.reset;
      },
    });
    async function resetPassword() {
      if (register.value.password !== register.value.confirmPassword) {
        swal("Error", "Password Mismatch", "error");
        return;
      }
      try {
        await axios.patch("user/reset", {
          code: register.value.code,
          password: register.value.password,
        });
      } catch (error) {
        swal("Error", error.response.data.message, "error");
        return;
      }
    }
    return {
      register,
      store,
      resetPassword,
      resetSuccess,
    };
  },
};
</script>

<style></style>
