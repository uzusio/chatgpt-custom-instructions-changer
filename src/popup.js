import { createApp } from "vue";
import vuetify from "./plugins/vuetify";
import popUp from "./components/popUp.vue";
import { loadFonts } from "./plugins/webfontloader";
import "./assets/global.scss";

loadFonts();

const app = createApp(popUp);
app.use(vuetify).mount("#app");
