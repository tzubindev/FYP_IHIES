import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import Login from "./pages/Login.vue";
import Button from "./components/Button.vue";
import Textbox from "./components/Textbox.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/login", component: Login }],
});

const app = createApp(App);

// Use Plugins
app.use(router);

// Attach Component vue file
app.component("Button", Button);
app.component("Textbox", Textbox);

app.mount("#app");
