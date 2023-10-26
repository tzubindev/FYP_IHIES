import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createVfm } from "vue-final-modal";

import App from "./App.vue";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
// Pages
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";

// Components
import Button from "./components/Button.vue";
import Textbox from "./components/Textbox.vue";
import Modal from "./components/Modal.vue";
import Loader from "./components/Loader.vue";

// Handling http req
import * as Vue from "vue"; // in Vue 3
import axios from "axios";
import VueAxios from "vue-axios";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/login", component: Login },
        { path: "/register", component: Register },
    ],
});

const app = createApp(App);
const vfm = createVfm();

app.use(router);
app.use(VueAxios, axios);
app.use(vfm);
app.use(VueSweetalert2);

app.component("Button", Button);
app.component("Textbox", Textbox);
app.component("Modal", Modal);
app.component("Loader", Loader);

app.mount("#app");
