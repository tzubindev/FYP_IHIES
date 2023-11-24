<template>
    <!-- TRANSLATION -->
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-100 absolute w-full h-screen bg-black text-red flex justify-center items-center"
        >
            <p class="access-denied-text font-extrabold">ACCESS DENIED</p>
        </div>

        <Loader
            :loading="!(is_verified && is_initiated) && !is_access_denied"
            class="w-4/5 z-30 absolute"
            v-if="!(is_verified && is_initiated) && !is_access_denied"
        ></Loader>

        <!-- Small screen size -->
        <div></div>

        <!-- Medium screen and above size-->
        <div
            v-if="is_verified && is_initiated"
            class="h-screen w-full flex flex-wrap overflow-y-auto"
        >
            <!-- Sidebar -->
            <Sidebar
                :username="this.user.name"
                @toggled="updateSidebarExpansion"
            ></Sidebar>

            <!-- Topbar -->
            <Topbar></Topbar>

            <!-- Schedule slot -->
            <div
                class="w-full h-full"
                :class="{
                    'pl-[180px]': is_sidebar_expanding,
                    'pl-[60px]': !is_sidebar_expanding,
                }"
            >
                <div class="pt-6 pb-8 px-10 w-full h-fit">
                    <!-- Path showing -->
                    <div
                        class="h-[40px] w-full font-extrabold p-2 text-xs flex justify-center"
                    >
                        <div
                            class="w-full max-w-[950px] flex items-center justify-start"
                        >
                            <p>{{ $t("healthie") }}</p>
                            <p class="mx-1.5">&gt;</p>
                            <p>{{ $t("schedule") }}</p>
                        </div>
                    </div>

                    <!-- Calendar and events -->
                    <div class="flex justify-center w-full">
                        <div
                            class="w-full grid grid-cols-5 gap-4 lg:max-w-[950px]"
                        >
                            <!-- Statistics -->
                            <div class="col-span-5 w-full p-2 pb-0">
                                <div
                                    class="col-span-5 w-full py-1 text-center bg-gray text-white"
                                >
                                    Overview
                                </div>
                            </div>
                            <div
                                class="col-span-5 grid-cols-3 grid w-full text-xs border-b-2 border-gray/20 pb-2"
                            >
                                <!-- Total -->
                                <div class="cursor-pointer p-2 min-h-[150px]">
                                    <div
                                        class="bg-yellow h-full p-2 shadow-xl flex flex-wrap"
                                    >
                                        <p
                                            class="bg-gray w-fit h-fit p-1 px-2 text-white"
                                        >
                                            Total
                                        </p>
                                        <p
                                            class="w-full flex items-center justify-center text-[64px]"
                                        >
                                            {{
                                                chartData.datasets[0].data.reduce(
                                                    (
                                                        accumulator,
                                                        currentValue
                                                    ) =>
                                                        accumulator +
                                                        currentValue,
                                                    0
                                                )
                                            }}
                                        </p>
                                        <p
                                            class="w-full flex justify-end items-end text-xs italic"
                                        >
                                            Events
                                        </p>
                                    </div>
                                </div>

                                <!-- Today Events -->
                                <div class="cursor-pointer p-2">
                                    <div
                                        class="bg-red h-full p-2 shadow-xl flex flex-wrap"
                                    >
                                        <p
                                            class="bg-gray w-fit h-fit p-1 px-2 text-white"
                                        >
                                            Today
                                        </p>
                                        <p
                                            class="w-full flex items-center justify-center text-[64px]"
                                        >
                                            {{ chartData.datasets[0].data[0] }}
                                        </p>
                                        <p
                                            class="w-full flex justify-end items-end text-xs italic"
                                        >
                                            Events
                                        </p>
                                    </div>
                                </div>

                                <!-- Future Events -->
                                <div class="cursor-pointer p-2">
                                    <div
                                        class="bg-green h-full p-2 shadow-xl flex flex-wrap"
                                    >
                                        <p
                                            class="bg-gray w-fit h-fit p-1 px-2 text-white"
                                        >
                                            In Future
                                        </p>
                                        <p
                                            class="w-full flex items-center justify-center text-[64px]"
                                        >
                                            {{ chartData.datasets[0].data[0] }}
                                        </p>
                                        <p
                                            class="w-full flex justify-end items-end text-xs italic"
                                        >
                                            Events
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Calendar -->
                            <div class="col-span-5 md:col-span-3 w-full">
                                <Calendar
                                    class="w-full"
                                    @selectedEvents="updateSelectedEvents"
                                ></Calendar>
                                <div
                                    class="gap-1 flex justify-center items-center w-full py-1.5 bg-red text-sm text-center mt-2 shadow-xl text-white cursor-pointer hover:bg-gray transition"
                                >
                                    <img
                                        src="../assets/add.svg"
                                        class="w-5 h-5"
                                    />
                                    Add New Schedule
                                </div>
                            </div>

                            <!-- Event Listing -->
                            <div
                                class="w-full h-fit p-3 px-2 bg-yellow col-span-5 md:col-span-2"
                            >
                                <div
                                    class="w-full bg-gray text-white text-center"
                                >
                                    Events
                                </div>
                                <Transition>
                                    <div
                                        class="mt-2 overflow-y-auto max-h-[340px] p-1"
                                        v-if="selected_events.length"
                                    >
                                        <div
                                            class=""
                                            v-for="(
                                                ev, index
                                            ) in selected_events"
                                            :key="index"
                                        >
                                            <Card
                                                class="flex flex-wrap mt-2 slide-in-left-to-right"
                                                :style="{
                                                    'animation-delay': `${
                                                        0.1 + index * 0.2
                                                    }s`,
                                                }"
                                            >
                                                <div
                                                    class="w-fit h-fit text-[12px] shadow bg-blue/80 p-2 py-0.5"
                                                >
                                                    {{ ev.date }}
                                                </div>
                                                <div class="grow"></div>
                                                <div
                                                    class="flex justify-center items-center"
                                                >
                                                    {{ ev.time }}
                                                </div>
                                                <div class="w-full text-[16px]">
                                                    {{ ev.title }}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                id: null,
                name: null,
                passcode: null,
            },

            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            selected_events: [],
            api_url: "http://127.0.0.1:3000",
            records: [],
            chartData: {
                labels: ["Scheduled", "Completed"],
                datasets: [
                    {
                        backgroundColor: ["#ee674a", "#474540"],
                        data: [2, 12],
                    },
                ],
            },
            chartOptions: {
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

        // this.user.passcode = await sessionStorage.getItem("passcode");
        // Remove the item from sessionStorage
        // UNCOMMENT
        // sessionStorage.removeItem("passcode");

        // Verify access
        // if (!this.user.passcode) {
        //     this.is_access_denied = true;
        // } else {
        //     this.user.id = this.$route.params.id;
        //     console.log(this.user.id);
        //     console.log(this.user.passcode);

        //     if (!(this.user.passcode && this.user.id)) {
        //         this.is_verified = true;
        //         this.is_access_denied = true;
        //         this.is_initiated = false;
        //         return;
        //     }

        //     try {
        //         const response = await this.axios.post(
        //             `${this.api_url}/username`,
        //             this.user
        //         );
        //         console.log("Start verification");

        //         this.is_verified = true;

        //         if (response.data.message.passcode_verification) {
        //             this.user.name = response.data.message.name;
        //             this.is_access_denied = false;
        //         } else {
        //             this.is_initiated = false;
        //             this.is_access_denied = true;
        //         }

        //         if (!this.is_access_denied) {
        //             // Get user preference language
        //             const localeResponse = await this.axios.get(
        //                 `${this.api_url}/locale/${this.user.id}`
        //             );
        //             console.log(localeResponse);

        //             this.$i18n.locale = localeResponse.data.message.locale;
        //             this.is_initiated = true;
        //         }
        //     } catch (error) {
        //         console.error("An error occurred:", error);
        //         // Handle error as needed
        //     }
        // }
    },

    methods: {
        async initiateDashboard(id) {
            this.$axios();
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        updateSelectedEvents(e) {
            console.log(e);
            this.selected_events = e;
        },
    },
};
</script>

<style>
.slide-in-left-to-right {
    opacity: 0;
    animation: slideInLeftToRight 0.5s ease-out forwards;
}

@keyframes slideInLeftToRight {
    0% {
        opacity: 0;
        transform: translateX(-100%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}
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
