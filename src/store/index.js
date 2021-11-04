import { reactive } from "vue";

const state = reactive({
  logged: false,
  register: false,
  profile: false,
  dashboard: false,
  activateUser: false,
  accessToken: null,
  resetPassword: false,
});

const methods = {
  // Login methods
  logIn() {
    state.logged = true;
  },
  logOut() {
    state.logged = false;
  },
  // Register methods
  register() {
    state.register = true;
  },
  cancelRegister() {
    state.register = false;
  },
  // Profile methods
  getProfile() {
    state.profile = true;
  },
  exitProfile() {
    state.profile = false;
  },
  // Dashboard methods
  getDashboard() {
    state.dashboard = true;
  },
  hideDashboard() {
    state.dashboard = false;
  },
  // Verify methods
  activateUser() {
    state.activateUser = true;
  },
  resetActivate() {
    state.activateUser = false;
  },
  // Token methods
  setToken(token) {
    state.accessToken = token;
  },
  removeToken() {
    state.accessToken = null;
  },
  // Reset password methods
  resetPassword() {
    state.resetPassword = true;
  },
  resetPasswordExit() {
    state.resetPassword = false;
  },
};

export default {
  state,
  methods,
};
