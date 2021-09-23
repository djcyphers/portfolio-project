import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../components/Welcome.vue";
import Header from "../components/Header.vue";
import Background from "../components/Background.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    Welcome,
    Header,
    Background,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
