import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Login from "./pages/Login.vue";
import Button from "./components/Button.vue";
import Textbox from "./components/Textbox.vue";

// Handling http req
import * as Vue from "vue"; // in Vue 3
import axios from "axios";
import VueAxios from "vue-axios";

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/login", component: Login }],
});

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

app.component("Button", Button);
app.component("Textbox", Textbox);

app.mount("#app");
