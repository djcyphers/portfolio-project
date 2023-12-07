import { reactive } from "vue";

const state = reactive({
  // Admin states
  logged: false,
  register: false,
  profile: false,
  dashboard: false,
  activateUser: false,
  accessToken: null,
  resetPassword: false,
  createGallery: false,
  // Gallery states
  isMainGalleryWrapperOpen: true, // might be useful later
  isGalleryViewOpen: true,
  isGalleryItemViewOpen: false,
  isNewGalleryFormOpen: false,
  isNewGalleryItemFormOpen: false,
  // Blog states
  isBlogViewOpen: true,
  isMainBlogWrapperOpen: true, // might be useful later as well
  isBlogPostViewOpen: false,
  isBlogEditorOpen: false,
  isBlogEditingPost: false,
  blogsStore: [],
  // Modal Blur
  isModalOpen: false,
  isBlogOpen: false,
  // Blog Pagination By Year
  isBlogYearFilterOpen: false,
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
  viewGallery() {
    state.isGalleryViewOpen = true;
  },
  exitGallery() {
    state.isGalleryViewOpen = false;
  },
  createGallery() {
    state.createGallery = true;
  },
  newGalleryForm() {
    state.isNewGalleryFormOpen = true;
  },
  closeGalleryForm() {
    state.isNewGalleryFormOpen = false;
  },
  viewGallery() {
    state.isGalleryViewOpen = true;
  },
  viewGalleryItems() {
    state.isGalleryItemViewOpen = true;
  },
  closeGalleryItems() {
    state.isGalleryItemViewOpen = false;
  },
  newGalleryItemForm() {
    state.isNewGalleryItemFormOpen = true;
  },
  closeGalleryItemForm() {
    state.isNewGalleryItemFormOpen = false;
  },
  // Blog methods
  viewBlogPosts() {
    state.isBlogViewOpen = true;
  },
  exitBlogPosts() {
    state.isBlogViewOpen = false;
  },
  toggleBlogEditor() {
    state.isBlogEditorOpen = !state.isBlogEditorOpen; // best way
  },
  toggleBlogPostView() {
    state.isBlogPostViewOpen = !state.isBlogPostViewOpen;
  },
  toggleBlogPostViewOff() {
    state.isBlogPostViewOpen = false;
  },
};

export default {
  state,
  methods,
};
