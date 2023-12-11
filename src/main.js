import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createVfm } from "vue-final-modal";

// Packages
import App from "./App.vue";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import dayjs from "dayjs";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "./style.scss";

// Pages
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";
import PatientDashboard from "./pages/PatientDashboard.vue";
import MedicalRecord from "./pages/MedicalRecord.vue";
import Schedule from "./pages/Schedule.vue";
import Inquiry from "./pages/Inquiry.vue";
import MedicalPersonnel from "./pages/MP_Dashboard.vue";
import ScheduleManagement from "./pages/ScheduleManagement.vue";
import PatientTransfer from "./pages/PatientTransfer.vue";
import IncidentReportChannel from "./pages/IncidentReportChannel.vue";
import Main from "./pages/Cover.vue";
import PatientMedicalRecord from "./pages/PatientMedicalRecord.vue";

// Components
import Button from "./components/Button.vue";
import Textbox from "./components/Textbox.vue";
import Modal from "./components/Modal.vue";
import Loader from "./components/Loader.vue";
import Dropdown from "./components/Dropdown.vue";
import Sidebar from "./components/Sidebar.vue";
import Topbar from "./components/Topbar.vue";
import Barloader from "./components/Barloader.vue";
import Calendar from "./components/Calendar.vue";
import Card from "./components/Card.vue";
import AI_Reco from "./components/AI_Reco.vue";
import AI_Loader from "./components/AI_Loader.vue";
import DoughnutChart from "./components/DoughnutChart.vue";
import AnimatedModal from "./components/AnimatedModal.vue";
import Notification from "./components/Notification.vue";
import DocumentViewer from "./components/DocumentViewer.vue";

// Handling http req
import axios from "axios";
import VueAxios from "vue-axios";

// Language packs
import { createI18n } from "vue-i18n";
import en from "./language_pack/en.json";
import zh_tw from "./language_pack/zh_tw.json";

// Router handling
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: Main },
        { path: "/login", component: Login },
        { path: "/register", component: Register },
        { path: "/dashboard/patient/:id", component: PatientDashboard },
        { path: "/medical-record/:id", component: MedicalRecord },
        { path: "/schedule/:id", component: Schedule },
        { path: "/inquiry/:id", component: Inquiry },
        {
            path: "/dashboard/mp/:id",
            component: MedicalPersonnel,
        },
        {
            path: "/dashboard/medical-personnel/:id",
            component: MedicalPersonnel,
        },
        { path: "/schedule-management/:id", component: ScheduleManagement },
        { path: "/patient-transfer/:id", component: PatientTransfer },
        {
            path: "/incident-report-channel/:id",
            component: IncidentReportChannel,
        },
        {
            path: "/irc/:id",
            component: IncidentReportChannel,
        },
        {
            path: "/patient-medical-record/:id",
            component: PatientMedicalRecord,
        },
        {
            path: "/pmr/:id",
            component: PatientMedicalRecord,
        },
    ],
});

// Language pack Initiate
const i18n = createI18n({
    locale: "en", // Default locale
    messages: {
        en,
        zh_tw,
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
app.component("Calendar", Calendar);
app.component("Card", Card);
app.component("VueDatePicker", VueDatePicker);
app.component("AI_Reco", AI_Reco);
app.component("AI_Loader", AI_Loader);
app.component("DoughnutChart", DoughnutChart);
app.component("AnimatedModal", AnimatedModal);
app.component("Notification", Notification);
app.component("DocumentViewer", DocumentViewer);

// Apply dayjs
app.config.globalProperties.$dayjs = dayjs;

app.mount("#app");
