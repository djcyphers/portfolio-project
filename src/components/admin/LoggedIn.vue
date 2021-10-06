<template>
  <ul class="nav nav-pills flex-column mb-auto">
    <li class="nav-item">
      <!-- Give element active class onclick -->
      <a href="#" class="nav-link text-white" aria-current="page">
        <svg class="bi me-2" width="16" height="16">
         <font-awesome-icon :icon="['fas', 'clipboard-list']" />
        </svg>
        Dashboard
      </a>
    </li>
    <li>
      <a href="#" class="nav-link text-white">
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fa', 'atlas']" />
        </svg>
        Blog
      </a>
    </li>
    <li>
      <a href="#" class="nav-link text-white">
        <svg class="bi me-2" width="16" height="16">
          <font-awesome-icon :icon="['fas', 'images']" />
        </svg>
        Gallery
      </a>
    </li>
    <li>
      <a href="#" class="nav-link text-white">
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
      <li><a class="dropdown-item" href="#">New blog...</a></li>
      <li><a class="dropdown-item" href="#">Profile</a></li>
      <li><a class="dropdown-item" href="#">Settings</a></li>
      <li><hr class="dropdown-divider" /></li>
      <li>
        <a
          class="dropdown-item"
          href="#"
          @click="
            logoutUser();
            removeAuth();
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
    return {
      logoutUser,
    };
  },
  methods: {
    removeAuth() {
      localStorage.removeItem("jwt");
      swal("Success", "You are now logged out!", "success");
    },
  },
};
</script>
