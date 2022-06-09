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
      <a href="#" class="nav-link text-white" @click="toggleNavItem($event)">
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fa', 'atlas']" />
        </svg>
        Blog
      </a>
    </li>
    <li>
      <a
        href="#"
        class="nav-link text-white"
        @click="
          toggleNavItem($event);
          viewGallery();
        "
      >
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
      class="
        d-flex
        align-items-center
        text-white text-decoration-none
        dropdown-toggle
      "
      id="dropdownUser1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <img
        src="https://github.com/mdo.png"
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
export default {
  name: "LoggedIn",
  setup() {
    const store = inject("store");
    const logoutUser = computed({
      get() {
        return store.methods.logOut;
      },
      set() {
        return store.methods.logOut;
      },
    });
    const getDashboard = computed({
      get() {
        return store.methods.getDashboard;
      },
      set() {
        return store.methods.getDashboard;
      },
    });
    const hideDashboard = computed({
      get() {
        return store.methods.hideDashboard;
      },
      set() {
        return store.methods.hideDashboard;
      },
    });
    const selectProfile = computed({
      get() {
        return store.methods.getProfile;
      },
      set() {
        return store.methods.getProfile;
      },
    });
    const removeToken = computed({
      get() {
        return store.methods.removeToken;
      },
      set() {
        return store.methods.removeToken;
      },
    });
    // View Gallery
    const viewGalleryStore = computed({
      get() {
        return store.methods.viewGallery;
      },
      set() {
        return store.methods.viewGallery;
      },
    });
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
    function viewGallery() {
      viewGalleryStore.value();
      document.querySelector("[data-menu='box3']").click();
    }
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