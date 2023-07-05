<template>
  <ul class="nav nav-pills flex-column mb-auto">
    <li class="nav-item">
      <!-- Give element active class onclick aria-current="page" -->
      <a
        href="#"
        class="nav-link text-white"
        @click="
          getDashboard();
          getSocialNav();
          toggleNavItem($event);
        "
      >
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fas', 'clipboard-list']" />
        </svg>
        Dashboard
      </a>
    </li>
    <li>
      <a
        href="#"
        class="nav-link text-white dropdown-toggle"
        data-bs-toggle="dropdown"
        @click="
          getSocialNav();
          hideDashboard();
          toggleNavItem($event);
        "
      >
        <ul
          class="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownGallery"
        >
          <li v-if="isBlogViewOpen">
            <a
              class="dropdown-item create-gallery-button"
              href="#"
              @click="
                toggleBlogEditor();
                exitBlogPosts();
              "
            >
              New Post
            </a>
          </li>
        </ul>
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fa', 'atlas']" />
        </svg>
        Blog
      </a>
    </li>
    <li>
      <a
        href="#"
        class="nav-link text-white dropdown-toggle"
        data-bs-toggle="dropdown"
        @click="toggleNavItem($event)"
      >
        <ul
          class="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownGallery"
        >
          <li v-if="isGalleryViewOpen">
            <a
              class="dropdown-item create-gallery-button"
              href="#"
              @click="toggleNewGalleryForm()"
            >
              New Gallery
            </a>
          </li>
          <li v-if="isGalleryItemViewOpen">
            <a
              class="dropdown-item create-galleryitem-button"
              href="#"
              @click="toggleNewGalleryItemForm()"
            >
              New Item
            </a>
          </li>
        </ul>
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fas', 'images']" />
        </svg>
        Gallery
      </a>
    </li>
    <li>
      <a href="#" class="nav-link text-white" @click="toggleNavItem($event)">
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fas', 'satellite']" />
        </svg>
        Livestream
      </a>
    </li>
  </ul>
  <hr />
  <div class="dropdown">
    <a
      href="#"
      class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
      id="dropdownUser1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <img
        :src="avatar"
        alt=""
        width="32"
        height="32"
        class="rounded-circle me-2"
      />
      <strong>DJ</strong>
    </a>
    <ul
      class="dropdown-menu dropdown-menu-dark text-small shadow"
      aria-labelledby="dropdownUser1"
    >
      <li>
        <a
          class="dropdown-item"
          href="#"
          @click="
            selectProfile();
            logoutUser();
          "
          >Profile</a
        >
      </li>
      <li><a class="dropdown-item" href="#">Settings</a></li>
      <li><hr class="dropdown-divider" /></li>
      <li>
        <a
          class="dropdown-item"
          href="#"
          @click="
            removeAuth();
            hideDashboard();
            logoutUser();
          "
          >Sign Out</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import swal from "sweetalert";
import axios from "axios";
import avatar from "../../assets/img/portfoliomini.png";
export default {
  name: "LoggedIn",
  setup() {
    // Store States
    const store = inject("store");
    const logoutUser = computed(() => store.methods.logOut);
    const getDashboard = computed(() => store.methods.getDashboard);
    const hideDashboard = computed(() => store.methods.hideDashboard);
    const selectProfile = computed(() => store.methods.getProfile);
    const removeToken = computed(() => store.methods.removeToken);
    const toggleBlogEditor = computed(() => store.methods.toggleBlogEditor);
    const exitBlogPosts = computed(() => store.methods.exitBlogPosts);
    // View Gallery
    const viewGallery = computed(() => store.methods.viewGallery);
    // Go to gallery item create view
    const isGalleryViewOpen = computed(() => store.state.isGalleryViewOpen);
    const isGalleryItemViewOpen = computed(
      () => store.state.isGalleryItemViewOpen
    );
    // Blog Views
    const isBlogViewOpen = computed(() => store.state.isBlogViewOpen);

    // Clear access token from MongoDB via Axios call
    async function removeAuth() {
      axios
        .get("/user/logout", {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            removeToken.value;
            swal("Success", response.data.message, "success");
          }
        })
        .catch((error) => {
          swal("Error", error.message, "error");
          console.log(error);
        });
    }
    // Move view over for better admin panel ux
    function getSocialNav() {
      document.querySelector("[data-menu='box4']").click();
    }
    // Toggle gallery view
    function toggleNewGalleryForm() {
      store.state.isGalleryViewOpen = false;
      store.state.isNewGalleryFormOpen = true;
    }
    // Toggle gallery item view
    function toggleNewGalleryItemForm() {
      store.state.isGalleryItemViewOpen = false;
      store.state.isNewGalleryItemFormOpen = true;
    }
    // Toggle active nav link and remove class from other nav links
    function toggleNavItem(event) {
      const navItems = document.querySelectorAll(".nav-link");
      navItems.forEach((item) => {
        item.classList.remove("active");
      });
      // Add active class to clicked nav link
      event.target.classList.add("active");
    }
    // View Gallery
    return {
      logoutUser,
      selectProfile,
      removeAuth,
      getDashboard,
      store,
      getSocialNav,
      hideDashboard,
      removeToken,
      toggleNavItem,
      viewGallery,
      toggleNewGalleryForm,
      toggleNewGalleryItemForm,
      toggleBlogEditor,
      isGalleryViewOpen,
      isGalleryItemViewOpen,
      isBlogViewOpen,
      exitBlogPosts,
      avatar,
    };
  },
};
</script>

<style lang="scss" scoped>
// Small hack before CSS migration
.dropdown-gallery:hover {
  background-color: #1e1e1e;
  color: #fff;
}
</style>
