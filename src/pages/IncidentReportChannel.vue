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

        <div
            v-if="is_verified && is_initiated"
            class="h-screen w-full flex flex-wrap overflow-y-auto"
        >
            <!-- Sidebar -->
            <Sidebar
                :username="this.user.name"
                medicalPersonnel
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
                            <p>{{ $t("incident_report_channel") }}</p>
                        </div>
                    </div>

                    <!-- Calendar and events -->
                    <div class="flex justify-center w-full">
                        <div class="w-full lg:max-w-[950px]">
                            <!-- Title + Add incident Button -->
                            <div
                                class="w-full flex justify-between items-center"
                            >
                                <div>{{ $t("my_incident") }}</div>
                                <div
                                    class="cursor-pointer bg-red hover:bg-darkred transition text-white p-2 py-1 text-[14px] flex items-center"
                                >
                                    <img
                                        src="../assets/add.svg"
                                        class="w-4 h-4 mr-1"
                                    />
                                    {{ $t("add_incident") }}
                                </div>
                            </div>

                            <!-- Search bar -->
                            <div class="mt-1 flex items-center p-1 px-0">
                                <input
                                    type="text"
                                    class="w-full focus:outline-none p-1 px-2 text-xs bg-gray text-white"
                                />
                                <img
                                    src="../assets/search.svg"
                                    class="cursor-pointer w-6 h-6 p-1 bg-gray/80 backdrop-blur transition hover:bg-gray/90"
                                />
                            </div>

                            <!-- Incidents -->
                            <div
                                class="border-t border-gray/30 mt-2 pt-2 text-[14px]"
                            >
                                <!-- Inc Title -->
                                <div class="grid grid-cols-5">
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="border-r border-white/30 h-full flex justify-center items-center"
                                        >
                                            {{ $t("id") }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="border-r border-white/30 h-full flex justify-center items-center"
                                        >
                                            {{ $t("type") }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="border-r border-white/30 h-full flex justify-center items-center"
                                        >
                                            {{ $t("description") }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="border-r border-white/30 h-full flex justify-center items-center"
                                        >
                                            {{ $t("created_dateTime") }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="h-full flex justify-center items-center"
                                        >
                                            {{ $t("status") }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Inc content blocks -->
                                <div
                                    class="hover:bg-gray/10 cursor-pointer transition grid grid-cols-5 slide-in-left-to-right py-2 border-b border-x border-gray/30"
                                    v-for="(i, index) in incident"
                                    :key="index"
                                    :style="{
                                        'animation-delay': `${
                                            0.1 + index * 0.2
                                        }s`,
                                    }"
                                >
                                    <div class="text-center">{{ i.id }}</div>
                                    <div class="text-center">{{ i.type }}</div>
                                    <div class="text-center">
                                        {{ i.description }}
                                    </div>
                                    <div class="text-center">
                                        {{ i.created_datetime }}
                                    </div>
                                    <div class="text-center">
                                        {{ i.status }}
                                    </div>
                                </div>
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
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            selected_events: [],
            api_url: "http://127.0.0.1:3000",
            records: [],
            incident: [
                {
                    id: "1",
                    type: "workplace",
                    description: "asndkjosadnksaod",
                    created_datetime: "Test Date",
                    status: "accepted",
                },
                {
                    id: "1",
                    type: "workplace",
                    description: "asndkjosadnksaod",
                    created_datetime: "",
                    status: "accepted",
                },
                {
                    id: "1",
                    type: "workplace",
                    description: "asndkjosadnksaod",
                    created_datetime: "",
                    status: "accepted",
                },
            ],
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
    },
};
</script>

<style></style>
