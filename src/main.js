import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createVfm } from "vue-final-modal";

import App from "./App.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";

import Button from "./components/Button.vue";
import Textbox from "./components/Textbox.vue";
import Modal from "./components/Modal.vue";

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

app.component("Button", Button);
app.component("Textbox", Textbox);
app.component("Modal", Modal);

app.mount("#app");
