import { reactive } from "vue";

const state = reactive({
  logged: false,
  register: false,
});

const methods = {
  logIn() {
    state.logged = true;
  },
  logOut() {
    state.logged = false;
  },
  register() {
    state.register = true;
  },
  cancelRegister() {
    state.register = false;
  },
};

export default {
  state,
  methods,
};
