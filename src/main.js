import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import FontAwesomeIcon from "./assets/js/font-awesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "animate.css";
import jQuery from "jquery";
const $ = jQuery;
window.$ = $;

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");
