<template>
  <span class="fs-4 text-center">Reset Password</span>
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
      autocomplete="off"
      v-model="register.token"
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
    <!-- Reset password -->
    <div class="fs-6 text-center">Enter a New Password</div>
    <button class="btn btn-primary btn-block w-75 my-1" type="submit">
      Reset Password
    </button>
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
      token: "",
      password: "",
      confirmPassword: "",
    });
    const resetSuccess = computed({
      get() {
        return store.methods.resetPasswordExit;
      },
      set() {
        return store.methods.resetPasswordExit;
      },
    });
    async function resetPassword() {
      if (register.value.password !== register.value.confirmPassword) {
        swal("Error", "Password Mismatch", "error");
        return;
      }
      try {
        await axios
          .patch("user/reset", {
            token: register.value.token,
            newPassword: register.value.password,
            confirmPassword: register.value.confirmPassword,
          })
          .then((res) => {
            if (res.data.success) {
              swal("Success", "Password Reset Successfully", "success");
              resetSuccess.value();
            }
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
