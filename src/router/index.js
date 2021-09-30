import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Welcome from "../components/Welcome.vue";
import Header from "../components/Header.vue";
import Background from "../components/Background.vue";
import About from "../components/About.vue";
import NotFound from "../components/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    alias: ["/home", "/about", "/portfolio", "/social"],
    component: Home,
    Welcome,
    Header,
    Background,
    About,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.resolve({
  name: "not-found",
  params: { pathMatch: ["not", "found"] },
}).href; // '/not/found'

export default router;
