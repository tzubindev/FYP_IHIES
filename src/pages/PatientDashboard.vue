<template>
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-20 absolute w-full h-screen bg-black text-red flex justify-center items-center"
        >
            <p class="access-denied-text font-extrabold">ACCESS DENIED</p>
        </div>

        <Loader
            :loading="!is_verified || !is_initiated"
            class="w-4/5 z-30 absolute"
            v-if="!is_verified || !is_initiated"
        ></Loader>

        <!-- Small screen size -->
        <div></div>

        <!-- Medium screen size and above-->
        <div
            v-if="is_verified"
            class="h-screen w-full flex flex-wrap overflow-y-auto"
        >
            <!-- Sidebar -->
            <Sidebar :username="this.user.name"></Sidebar>

            <!-- Topbar -->
            <Topbar></Topbar>

            <!-- Dashboard -->
            <div class="pl-[180px] w-full h-full">
                <div class="pt-6 pb-4 px-10 w-full h-full">
                    <!-- Path showing -->
                    <div
                        class="h-[40px] font-extrabold p-2 text-xs flex justify-left items-center"
                    >
                        <p>{{ $t("healthie") }}</p>
                        <p class="mx-1.5">></p>
                        <p>{{ $t("dashboard") }}</p>
                    </div>

                    <!-- Profile  -->
                    <div
                        class="py-4 w-full flex h-fit bg-gray rounded-xl text-white items-center"
                    >
                        <!-- Picture -->
                        <div
                            class="h-full w-1/3 flex justify-center items-center"
                        >
                            <img
                                src="../sample_assets/profilePic_tb.jpg"
                                class="w-[150px] h-[150px] rounded-full"
                            />
                        </div>

                        <!-- Name and Access -->
                        <div class="h-full w-3/12 flex items-center pr-4">
                            <div>
                                <div class="font-extrabold text-xl">
                                    {{ $t("user") }}
                                </div>
                                <div class="text-md">
                                    {{ this.user.name }}
                                </div>
                                <div
                                    class="p-3 py-1.5 mt-4 text-xs w-fit rounded bg-white/20 cursor-pointer transition hover:bg-white hover:text-gray"
                                >
                                    {{ $t("view_profile") }}
                                </div>
                            </div>
                        </div>

                        <!-- Profile details -->
                        <div
                            class="h-full w-5/12 p-4 pl-2 gap-1 grid grid-cols-2 text-[12px] border-l border-white/20"
                        >
                            <!-- Sex -->
                            <div class="flex flex-wrap">
                                <div class="font-light w-fit">
                                    {{ $t("sex") }}
                                </div>
                                <div
                                    class="w-full text-center py-0.5 rounded font-extrabold"
                                >
                                    {{ $t("sex") }}
                                </div>
                            </div>
                            <!-- Age -->
                            <div class="flex flex-wrap">
                                <div class="font-light w-fit">
                                    {{ $t("age") }}
                                </div>
                                <div
                                    class="w-full text-center py-0.5 rounded font-extrabold"
                                >
                                    {{ $t("age") }}
                                </div>
                            </div>
                            <div>
                                <!-- blood -->
                                <div class="flex flex-wrap">
                                    <div class="font-light w-fit">
                                        {{ $t("blood") }}
                                    </div>
                                    <div
                                        class="w-full text-center py-0.5 rounded font-extrabold"
                                    >
                                        {{ $t("blood") }}
                                    </div>
                                </div>
                            </div>

                            <!-- height -->
                            <div class="flex flex-wrap">
                                <div class="font-light w-fit">
                                    {{ $t("height") }}
                                </div>
                                <div
                                    class="w-full text-center py-0.5 rounded font-extrabold"
                                >
                                    {{ $t("height") }}
                                </div>
                            </div>

                            <!-- weight -->
                            <div class="flex flex-wrap">
                                <div class="font-light w-fit">
                                    {{ $t("weight") }}
                                </div>
                                <div
                                    class="w-full text-center py-0.5 rounded font-extrabold"
                                >
                                    {{ $t("weight") }}
                                </div>
                            </div>

                            <!--last logged in  -->
                            <div class="flex flex-wrap">
                                <div class="font-light w-fit">
                                    {{ $t("last_logged_in") }}
                                </div>
                                <div
                                    class="w-full text-center py-0.5 rounded font-extrabold"
                                >
                                    {{ $t("last_logged_in") }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Statistics -->
                    <div class="w-full h-full max-h-[500px] pt-3">
                        <div
                            class="w-full h-full border-y border-gray/20 text-[14px]"
                        >
                            <div class="w-full my-1.5">
                                {{ $t("personal_data") }}
                            </div>

                            <div class="w-full h-5/6 grid grid-cols-2 gap-2">
                                <div class="bg-gray w-full h-full rounded-xl">
                                    <Line :data="data" :options="options" />
                                </div>
                                <div
                                    class="bg-gray w-full h-full rounded-xl"
                                ></div>
                                <div
                                    class="bg-gray w-full h-full rounded-xl"
                                ></div>
                                <div
                                    class="bg-gray w-full h-full rounded-xl"
                                ></div>
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

export default {
    components: {
        Line,
    },
    data() {
        return {
            user: {
                id: null,
                name: null,
                passcode: null,
            },

            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            api_url: "http://127.0.0.1:3000",

            // chart
            data: {
                labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                ],
                datasets: [
                    {
                        label: "Data One",
                        backgroundColor: "#f87979",
                        data: [40, 39, 10, 40, 39, 80, 40],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },
    async created() {
        console.log("CREATED");
    },
    async mounted() {
        console.log("MOUNTED");

        if (!this.$route.query.hasOwnProperty("passcode"))
            this.is_access_denied = true;

        this.user.id = this.$route.params.id;
        if (!this.user.passcode)
            this.user.passcode = this.$route.query.passcode;

        await this.axios
            .post(`${this.api_url}/username`, this.user)
            .then((response) => {
                console.log("start verification");

                this.is_verified = true;
                if (response.data.message.passcode_verification) {
                    this.user.name = response.data.message.name;
                    this.is_access_denied = false;
                } else {
                    this.is_initiated = false;
                    this.is_access_denied = true;
                }
            });

        try {
            if (!this.is_access_denied) {
                // Get user preference language
                await this.axios
                    .get(`${this.api_url}/locale/${this.user.id}`)
                    .then((response) => {
                        console.log(response);
                        this.$i18n.locale = response.data.message.locale;
                    });
                this.is_initiated = true;
            }
        } catch (e) {
            console.log(e);
        }
    },
    methods: {
        async initiateDashboard(id) {
            this.$axios();
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

.access-denied-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: black;
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
}

.access-denied-text {
    cursor: pointer;
    position: relative; /* Relative positioning for the pseudo-element */
}

.access-denied-text::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px; /* Adjust the height for your desired line thickness */
    background-color: red;
    transform: scaleX(0); /* Initial scale to hide the line */
    transform-origin: right;
    transition: transform 0.3s ease; /* Add a smooth transition for the line */
}

.access-denied-text:hover::before {
    transform: scaleX(1); /* Scale to show the line on hover */
    transform-origin: left;
}
</style>
