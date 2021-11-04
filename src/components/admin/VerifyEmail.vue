<template>
  <span class="fs-4 text-center">Verify Email</span>
  <form
    class="text-center"
    style="margin-top: 10px; height: auto"
    @submit.prevent="activateUser"
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
      type="code"
      id="code"
      class="form-control mb-3"
      placeholder="Code"
      autocomplete="on"
      v-model="login.code"
      required
    />
    <!-- Sign in button -->
    <button class="btn btn-primary btn-block w-75 my-3" type="submit">
      Activate Account
    </button>
  </form>
</template>

<script>
import { ref, inject, computed } from "vue";
import axios from "axios";
import swal from "sweetalert";

export default {
  name: "VerifyEmail",
  setup() {
    let success = ref(false);
    let login = ref({
      email: "",
      code: "",
    });
    const store = inject("store");
    const verifiedUser = computed({
      get() {
        return store.methods.resetActivate;
      },
      set() {
        return store.methods.resetActivate;
      },
    });
    async function activateUser() {
      await axios
        .post("user/activate", login.value)
        .then((response) => {
          if (response.data.success) {
            swal("Success", "Account Activated", "success");
            verifiedUser.value();
          }
        })
        .catch(function (error) {
          if (error.response) {
            // Incorrect verification code
            console.log(error.response);
            swal("Error", error.response, "error");
          }
        });
    }
    return {
      store,
      verifiedUser,
      success,
      login,
      activateUser,
    };
  },
};
</script>
