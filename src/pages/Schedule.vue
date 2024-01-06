<template>
    <!-- TRANSLATION -->
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <AccessDenied v-if="is_access_denied"></AccessDenied>

        <Loader
            :loading="!(is_verified && is_initiated) && !is_access_denied"
            class="w-4/5 z-30 absolute"
            v-if="!(is_verified && is_initiated) && !is_access_denied"
        ></Loader>

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
                            class="w-full grid grid-cols-5 gap-1 lg:max-w-[950px]"
                        >
                            <!-- Statistics -->

                            <div
                                class="col-span-5 grid-cols-3 grid w-full text-xs border-b-2 border-gray/20 pb-2 mb-2"
                            >
                                <!-- Total -->
                                <div
                                    class="cursor-pointer p-2 pt-0 min-h-[150px]"
                                >
                                    <div
                                        class="bg-gray/90 text-white h-full p-2 flex flex-wrap shadow-md shadow-gray"
                                    >
                                        <p
                                            class="bg-red w-fit h-fit p-1 px-2 text-white shadow shadow-white/20"
                                        >
                                            {{ $t("total") }}
                                        </p>
                                        <p
                                            class="w-full flex items-center justify-center text-[64px]"
                                        >
                                            {{ event.total }}
                                        </p>
                                        <p
                                            class="w-full flex justify-end items-end text-xs italic"
                                        >
                                            {{ $t("events") }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Today Events -->
                                <div class="cursor-pointer p-2 pt-0">
                                    <div
                                        class="bg-green h-full p-2 flex flex-wrap shadow-md shadow-gray"
                                    >
                                        <p
                                            class="bg-darkgreen w-fit h-fit p-1 px-2 text-white shadow shadow-gray"
                                        >
                                            {{ $t("today") }}
                                        </p>
                                        <p
                                            class="w-full flex items-center justify-center text-[64px]"
                                        >
                                            {{ event.today }}
                                        </p>
                                        <p
                                            class="w-full flex justify-end items-end text-xs italic"
                                        >
                                            {{ $t("events") }}
                                        </p>
                                    </div>
                                </div>

                                <!-- Future Events -->
                                <div class="cursor-pointer p-2 pt-0">
                                    <div
                                        class="bg-yellow h-full p-2 flex flex-wrap shadow-md shadow-gray"
                                    >
                                        <p
                                            class="bg-darkyellow w-fit h-fit p-1 px-2 text-white shadow shadow-gray"
                                        >
                                            {{ $t("in_future") }}
                                        </p>
                                        <p
                                            class="w-full flex items-center justify-center text-[64px]"
                                        >
                                            {{ event.infuture }}
                                        </p>
                                        <p
                                            class="w-full flex justify-end items-end text-xs italic"
                                        >
                                            {{ $t("events") }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Calendar -->
                            <div class="col-span-5 md:col-span-3 w-full">
                                <Calendar
                                    class="w-full"
                                    @selectedEvents="updateSelectedEvents"
                                    @updateEventCalculation="
                                        updateEventCalculation
                                    "
                                ></Calendar>
                            </div>

                            <!-- Event Listing -->
                            <div
                                class="w-full h-fit p-3 px-2 bg-gray col-span-5 md:col-span-2"
                            >
                                <div
                                    class="w-full bg-white/10 text-white text-center"
                                >
                                    {{ $t("events") }}
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
                                                class="bg-white/80 hover:bg-white/50 flex flex-wrap mt-2 slide-in-left-to-right"
                                                :style="{
                                                    'animation-delay': `${
                                                        0.1 + index * 0.2
                                                    }s`,
                                                }"
                                                @click="openEventModal(ev)"
                                            >
                                                <div
                                                    class="w-fit h-fit text-[12px] bg-red/50 p-2 py-0.5 shadow shadow-gray"
                                                >
                                                    {{
                                                        formatData(ev.timestamp)
                                                    }}
                                                </div>

                                                <div
                                                    class="w-full text-[16px] text-right pt-2 font-bold"
                                                >
                                                    {{ ev.institution_id }}
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
            event: {
                total: null,
                today: null,
                infuture: null,
            },
        };
    },
    async created() {
        console.log("CREATED");
    },

    methods: {
        updateEventCalculation(e) {
            this.event = e;
        },
        formatData(timestamp) {
            return this.$dayjs(timestamp).format(
                `[DATE] YYYY-MM-DD | [TIME] HH:00`
            );
        },

        async initiateDashboard(id) {
            this.$axios();
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        updateSelectedEvents(e) {
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
