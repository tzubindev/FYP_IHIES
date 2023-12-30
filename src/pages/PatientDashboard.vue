<template>
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <!-- <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-100 absolute w-full h-screen bg-black text-red flex justify-center items-center"
        >
            <p class="access-denied-text font-extrabold">ACCESS DENIED</p>
        </div> -->
        <AccessDenied v-if="is_access_denied"></AccessDenied>

        <Loader
            :loading="!(is_verified && is_initiated) && !is_access_denied"
            class="w-4/5 z-30 absolute"
            v-if="!(is_verified && is_initiated) && !is_access_denied"
        ></Loader>

        <Profile
            v-show="is_profile_opened"
            :profile="profile"
            @close="toggleProfile"
        ></Profile>

        <!-- Medium screen and above size-->
        <div
            v-if="is_verified && is_initiated"
            class="h-screen w-full flex flex-wrap overflow-y-auto"
        >
            <!-- Sidebar -->
            <Sidebar
                :username="this.profile.name"
                @toggled="updateSidebarExpansion"
            ></Sidebar>

            <!-- Topbar -->
            <Topbar></Topbar>

            <!-- Dashboard -->
            <div
                class="w-full h-full"
                :class="{
                    'pl-[180px]': is_sidebar_expanding,
                    'pl-[60px]': !is_sidebar_expanding,
                }"
            >
                <div class="pt-6 pb-4 px-10 w-full h-fit">
                    <!-- Path showing -->
                    <div
                        class="h-[40px] w-full font-extrabold p-2 text-xs flex justify-center"
                    >
                        <div
                            class="w-full max-w-[1140px] flex items-center justify-start"
                        >
                            <p>{{ $t("healthie") }}</p>
                            <p class="mx-1.5">&gt;</p>
                            <p>{{ $t("dashboard") }}</p>
                        </div>
                    </div>

                    <div class="lg:grid grid-cols-2 gap-2">
                        <!-- Profile -->
                        <div
                            class="w-full grid grid-cols-2 lg:grid-cols-1 lg:h-full lg:pb-3 gap-2 h-fit items-center"
                        >
                            <!-- Profile -->
                            <div
                                class="text-[12px] h-full w-full flex flex-wrap justify-center items-center bg-gray text-white p-4 pb-8"
                            >
                                <div
                                    class="font-extrabold text-[12px] w-full flex justify-end"
                                >
                                    <div class="bg-red w-fit p-1 px-2">
                                        {{ $t("user") }}
                                    </div>
                                </div>
                                <img
                                    src="../sample_assets/profilePic_tb.jpg"
                                    class="w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] mx-auto rounded-full"
                                />

                                <div
                                    class="w-full text-center text-white/70 italic mt-4"
                                >
                                    @{{ this.user.id }}
                                </div>

                                <div class="text-[20px] w-full text-center">
                                    {{ this.profile.name }}
                                </div>
                                <div
                                    class="cursor-pointer transition p-2 px-4 border border-red text-red hover:bg-red hover:text-white mt-3"
                                    @click="
                                        is_profile_opened = !is_profile_opened
                                    "
                                >
                                    {{ $t("view_profile") }}
                                </div>
                            </div>

                            <!-- Profile details -->
                            <div
                                class="h-full w-full p-4 gap-2 grid grid-cols-2 text-[12px] bg-white/60 shadow shadow-gray/50"
                            >
                                <!-- Sex -->
                                <div
                                    class="flex flex-wrap bg-gradient-to-br from-red/10 to-cool/30 shadow shadow-gray"
                                >
                                    <!-- label -->
                                    <div
                                        class="font-light w-full flex items-center justify-center"
                                    >
                                        {{ $t("sex") }}
                                    </div>
                                    <!-- data -->
                                    <div
                                        class="w-full text-center font-extrabold flex justify-center items-start text-[18px]"
                                        v-if="profile.sex"
                                    >
                                        {{ $t(profile.sex) }}
                                    </div>
                                    <Barloader v-if="!profile.sex" />
                                </div>
                                <!-- Age -->
                                <div
                                    class="flex flex-wrap bg-gradient-to-br from-red/10 to-cool/30 shadow shadow-gray"
                                >
                                    <!-- label -->
                                    <div
                                        class="font-light w-full flex items-center justify-center"
                                    >
                                        {{ $t("age") }}
                                    </div>
                                    <!-- data -->
                                    <div
                                        class="w-full text-center font-extrabold flex justify-center items-start text-[18px]"
                                        v-if="profile.age"
                                    >
                                        {{ profile.age }}
                                    </div>
                                    <Barloader v-if="!profile.age" />
                                </div>
                                <div>
                                    <!-- blood -->
                                    <div
                                        class="h-full flex flex-wrap bg-gradient-to-br from-red/10 to-cool/30 shadow shadow-gray"
                                    >
                                        <div
                                            class="font-light w-full flex items-center justify-center"
                                        >
                                            {{ $t("blood") }}
                                        </div>
                                        <div
                                            class="w-full text-center font-extrabold flex justify-center items-start text-[18px]"
                                            v-if="profile.blood"
                                        >
                                            {{ profile.blood }}
                                        </div>
                                        <Barloader v-if="!profile.blood" />
                                    </div>
                                </div>

                                <!-- height -->
                                <div
                                    class="flex flex-wrap bg-gradient-to-br from-red/10 to-cool/30 shadow shadow-gray"
                                >
                                    <div
                                        class="font-light w-full flex items-center justify-center"
                                    >
                                        {{ $t("height") }}
                                    </div>
                                    <div
                                        class="w-full text-center font-extrabold flex justify-center items-start text-[18px]"
                                        v-if="profile.height"
                                    >
                                        {{ profile.height }} m
                                    </div>
                                    <Barloader v-if="!profile.height" />
                                </div>

                                <!-- weight -->
                                <div
                                    class="flex flex-wrap bg-gradient-to-br from-red/10 to-cool/30 shadow shadow-gray"
                                >
                                    <div
                                        class="font-light w-full flex items-center justify-center"
                                    >
                                        {{ $t("weight") }}
                                    </div>
                                    <div
                                        class="w-full text-center font-extrabold flex justify-center items-start text-[18px]"
                                        v-if="profile.weight"
                                    >
                                        {{ profile.weight }} kg
                                    </div>
                                    <Barloader v-if="!profile.weight" />
                                </div>

                                <!--last logged in-->
                                <div
                                    class="flex flex-wrap bg-gradient-to-br from-gray/10 to-cool/10 shadow shadow-gray"
                                >
                                    <div
                                        class="font-light w-full flex items-center justify-center"
                                    >
                                        {{ $t("last_logged_in") }}
                                    </div>
                                    <div
                                        class="px-2 w-full text-center font-extrabold flex justify-center items-start text-[14px]"
                                        v-if="profile.last"
                                    >
                                        {{ profile.last }}
                                    </div>
                                    <Barloader v-if="!profile.last" />
                                </div>
                            </div>
                        </div>

                        <!-- Statistics -->
                        <div class="w-full h-full py-3 lg:py-0">
                            <div
                                class="w-full h-full border-y border-gray/20 lg:border-none pb-3 text-[14px]"
                            >
                                <div class="w-full my-1.5">
                                    {{ $t("personal_data") }}
                                </div>

                                <div
                                    class="w-full h-5/6 grid grid-cols-1 gap-6 lg:gap-2"
                                >
                                    <!-- SYS -->
                                    <div
                                        class="cursor-pointer bg-gray text-white p-4 pt-2 pb-0 w-full h-44 lg:h-32"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("sys") }}
                                                </p>

                                                <img
                                                    src="../assets/heart.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_sys.datasets[0]
                                                            .data[
                                                            data_sys.datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-white/60 italic"
                                                >
                                                    {{ $t("mmHg") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_sys"
                                                :options="options_sys"
                                            />
                                        </div>
                                    </div>

                                    <!-- DIA -->
                                    <div
                                        class="cursor-pointer text-gray border-2 border-gray/40 p-4 pt-2 pb-0 w-full h-44 lg:h-32"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("dia") }}
                                                </p>

                                                <img
                                                    src="../assets/heart.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_dia.datasets[0]
                                                            .data[
                                                            data_dia.datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-gray/60 italic"
                                                >
                                                    {{ $t("mmHg") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_dia"
                                                :options="options_dia"
                                            />
                                        </div>
                                    </div>

                                    <!-- Pulse -->
                                    <div
                                        class="cursor-pointer text-gray border-2 border-gray/40 p-4 pt-2 pb-0 w-full h-44 lg:h-32"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("pulse") }}
                                                </p>

                                                <img
                                                    src="../assets/pulse.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_pulse.datasets[0]
                                                            .data[
                                                            data_pulse
                                                                .datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-gray/60 italic"
                                                >
                                                    {{ $t("bpm") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_pulse"
                                                :options="options_pulse"
                                            />
                                        </div>
                                    </div>

                                    <!-- Breath -->
                                    <div
                                        class="cursor-pointer text-gray border-2 border-gray/40 p-4 pt-2 pb-0 w-full h-44 lg:h-32"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("breath") }}
                                                </p>

                                                <img
                                                    src="../assets/breath.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_breath.datasets[0]
                                                            .data[
                                                            data_breath
                                                                .datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-gray/60 italic"
                                                >
                                                    {{ $t("tpm") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_breath"
                                                :options="options_breath"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Path to view medical record -->
                    <div class="w-full h-32 flex justify-center">
                        <div
                            class="cursor-pointer transition hover:shadow w-full max-w-[1140px] mb-4 shadow-gray/40 shadow-xl overflow-hidden relative"
                            @click="this.leadTo('medical-record')"
                        >
                            <img
                                src="../assets/medical_record.jpg"
                                class="h-full w-full object-cover"
                                alt="Medical Record"
                            />
                            <div
                                class="absolute inset-0 bg-gray opacity-70"
                            ></div>
                            <div
                                class="hover:bg-gray/40 text-white absolute inset-0 flex justify-center items-center font-extrabold text-3xl"
                            >
                                {{ $t("view_your_medical_record") }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

ChartJS.defaults.plugins.legend.display = false;

export default {
    components: {
        Line,
    },
    data() {
        return {
            user: {
                id: null,
                passcode: null,
            },

            profile: {
                name: "",
                sex: null,
                age: null,
                blood: null,
                height: null,
                weight: null,
                last: null,
            },

            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            is_sidebar_expanding: false,
            is_profile_opened: false,
            api_url: "http://127.0.0.1:3000",

            // Chart
            // SYS
            data_sys: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [],
                    },
                ],
            },
            options_sys: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255,255,255,0.5)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(255,255,255,0.5)",
                        },
                    },
                },
            },
            // DIA
            data_dia: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [],
                    },
                ],
            },
            options_dia: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                },
            },
            // pulse
            data_pulse: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [],
                    },
                ],
            },
            options_pulse: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                },
            },

            // breath
            data_breath: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [],
                    },
                ],
            },
            options_breath: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                },
            },
        };
    },
    async created() {
        console.log("CREATED");

        this.user.passcode = await sessionStorage.getItem("passcode");
        const obtainedUser = await JSON.parse(sessionStorage.getItem("user"));
        this.user.id = obtainedUser.id;
        this.user.role = obtainedUser.role;

        if (!this.user.passcode) {
            this.is_access_denied = true;
        } else {
            // LAST CHECK
            if (!(this.user.passcode && this.user.id && this.user.role)) {
                this.is_verified = true;
                this.is_access_denied = true;
                this.is_initiated = false;
                return;
            }

            try {
                const response = await this.axios.get(
                    `${this.api_url}/profile`,
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                        data: {
                            user: this.user,
                        },
                    }
                );

                console.log("Start Initiation");
                this.is_verified = true;
                await this.initiateDashboard(response.data.message.profile);
                this.is_initiated = true;
            } catch (error) {
                console.error("An error occurred:", error);
                this.is_initiated = false;
                this.is_access_denied = true;
            }
        }
    },

    methods: {
        async initiateDashboard(profile) {
            // Format
            //  name: null,
            //  sex: null,
            //  age: null,
            //  blood: null,
            //  height: null,
            //  weight: null,
            //  last: null,
            // Initialise Language
            this.$i18n.locale = profile.language;

            // Initialise statistic data
            this.data_sys.datasets[0].data = profile.sys.map((e) =>
                parseFloat(e)
            );
            this.data_dia.datasets[0].data = profile.dia.map((e) =>
                parseFloat(e)
            );
            this.data_pulse.datasets[0].data = profile.pulse;
            this.data_breath.datasets[0].data = profile.breath;

            // Standardise
            profile.age = this.calculateAge(profile.born_date);
            profile.last = this.formatDateTime(profile.last);

            // Remove unnecessary data
            delete profile.sys;
            delete profile.dia;
            delete profile.pulse;
            delete profile.breath;

            // Initiation
            this.profile = profile;
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        leadTo(des) {
            this.$router.push(`/${des}/${this.$route.params.id}`);
        },
        calculateAge(birthDateString) {
            const birthDate = new Date(birthDateString);
            const currentDate = new Date();

            // Calculate the difference in years
            let age = currentDate.getFullYear() - birthDate.getFullYear();

            // Check if the birthday has occurred this year
            if (
                currentDate.getMonth() < birthDate.getMonth() ||
                (currentDate.getMonth() === birthDate.getMonth() &&
                    currentDate.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            return age;
        },
        formatDateTime(isoString) {
            const date = new Date(isoString);

            // Get individual date and time components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");

            // Create the formatted string
            const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

            return formattedDateTime;
        },
        toggleProfile() {
            this.is_profile_opened = !this.is_profile_opened;
        },
    },
};
</script>

<style>
* {
    user-select: none;
}
.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-2px);
    opacity: 0;
}
</style>
