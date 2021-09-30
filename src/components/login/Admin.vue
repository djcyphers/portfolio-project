<template>
  <div
    class="
      d-flex
      flex-column flex-shrink-0
      p-3
      text-white
      admin-panel
      d-none
      animate__animated
    "
    id="admin-panel"
    style="width: 180px"
  >
    <a
      href="#"
      @click="closePanel"
      class="
        d-flex
        align-items-center
        mb-3 mb-md-0
        me-md-auto
        text-white text-decoration-none
      "
    >
      <img class="bi me-2" width="32" height="32" :src="avatar" />
      <span class="fs-4 text-center">Admin Panel</span>
    </a>
    <hr />
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <a href="#" class="nav-link active" aria-current="page">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#dashboard" />
          </svg>
          Dashboard
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#blog" />
          </svg>
          Blog
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#gallery" />
          </svg>
          Gallery
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <svg class="bi me-2" width="16" height="16">
            <use xlink:href="#livestream" />
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
        <li><a class="dropdown-item" href="#">Sign out</a></li>
      </ul>
    </div>
  </div>
  <div
    class="avatar-login animate__animated"
    id="avatar-login"
    @click="openPanel"
  >
    <img class="bi me-2" width="64" height="64" :src="avatar" />
  </div>
</template>

<script>
import avatar from "../../assets/img/avatar.png";

export default {
  name: "Admin",
  data() {
    return {
      avatar,
    };
  },
  methods: {
    openPanel: () => {
      const adminPanel = document.getElementById("admin-panel");
      const avatarLogin = document.getElementById("avatar-login");
      adminPanel.classList.remove("d-none");
      adminPanel.classList.remove("animate__backOutRight");
      avatarLogin.classList.remove("animate__backInRight");
      adminPanel.classList.add("animate__backInRight");
      avatarLogin.classList.add("animate__backOutRight");
    },
    closePanel: () => {
      const adminPanel = document.getElementById("admin-panel");
      const avatarLogin = document.getElementById("avatar-login");
      adminPanel.classList.remove("animate__backInRight");
      avatarLogin.classList.remove("animate__backOutRight");
      adminPanel.classList.add("animate__backOutRight");
      avatarLogin.classList.add("animate__backInRight");
    },
  },
};
</script>
