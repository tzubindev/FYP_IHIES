import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createVfm } from "vue-final-modal";

// Packages
import App from "./App.vue";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Pages
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import PatientDashboard from "./pages/PatientDashboard.vue";

// Components
import Button from "./components/Button.vue";
import Textbox from "./components/Textbox.vue";
import Modal from "./components/Modal.vue";
import Loader from "./components/Loader.vue";
import Dropdown from "./components/Dropdown.vue";
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import Barloader from "./components/Barloader.vue";

// Handling http req
import axios from "axios";
import VueAxios from "vue-axios";

// Language packs
import { createI18n } from "vue-i18n";
import en from "./language_pack/en.json";
import cn_tw from "./language_pack/cn_tw.json";

// Router handling
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Login },
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/patient/:id", component: PatientDashboard },
    ],
});

// Language pack Initiate
const i18n = createI18n({
    locale: "en", // Default locale
    messages: {
        en,
        cn_tw,
    },
});

// App initiation
const app = createApp(App);
const vfm = createVfm();

app.use(router);
app.use(VueAxios, axios);
app.use(vfm);
app.use(VueSweetalert2);
app.use(i18n);

app.component("Button", Button);
app.component("Textbox", Textbox);
app.component("Modal", Modal);
app.component("Loader", Loader);
app.component("Dropdown", Dropdown);
app.component("Sidebar", Sidebar);
app.component("Topbar", Topbar);
app.component("Barloader", Barloader);

app.mount("#app");
