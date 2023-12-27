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
                            <p>{{ $t("access_management") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full">
                        <div class="w-full lg:max-w-[950px] p-2 flex-wrap flex">
                            <div
                                class="w-full flex justify-between items-center mb-2"
                            >
                                <div>{{ $t("access_list") }}</div>
                                <div
                                    class="hover:bg-green/80 cursor-pointer transition shadow shadow-gray p-1 px-2 bg-green text-gray flex items-center text-[16px]"
                                >
                                    <img
                                        src="../assets/save.svg"
                                        class="w-4 h-4 mr-1"
                                    />
                                    {{ $t("save") }}
                                </div>
                            </div>

                            <!-- List -->
                            <!-- Headers -->
                            <div class="grid grid-cols-7 text-[12px] w-full">
                                <div
                                    v-for="(h, index) in headers"
                                    :key="index"
                                    class="bg-gray text-white py-1.5"
                                >
                                    <div
                                        class="text-center h-full w-full flex items-center justify-center px-1"
                                        :class="{
                                            'border-r border-white/30':
                                                index !== headers.length - 1,
                                        }"
                                    >
                                        {{ $t(h) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Data rows -->
                            <div
                                class="w-full text-[12px] hover:bg-gray/10 cursor-pointer transition grid grid-cols-7 slide-in-left-to-right py-2 border-b border-x border-gray/30"
                                v-for="(p, index) in mp"
                                :key="index"
                                :style="{
                                    'animation-delay': `${0.1 + index * 0.2}s`,
                                }"
                            >
                                <div class="text-center">{{ p.id }}</div>
                                <div class="text-center">{{ p.name }}</div>
                                <div
                                    class="w-full flex justify-center items-center"
                                >
                                    <input
                                        type="checkbox"
                                        class="w-3 h-3"
                                        v-model="p.sm"
                                    />
                                </div>
                                <div
                                    class="w-full flex justify-center items-center"
                                >
                                    <input
                                        type="checkbox"
                                        class="w-3 h-3"
                                        v-model="p.cmr"
                                    />
                                </div>
                                <div
                                    class="w-full flex justify-center items-center"
                                >
                                    <input
                                        type="checkbox"
                                        class="w-3 h-3"
                                        v-model="p.rmr"
                                    />
                                </div>
                                <div
                                    class="w-full flex justify-center items-center"
                                >
                                    <input
                                        type="checkbox"
                                        class="w-3 h-3"
                                        v-model="p.pt"
                                    />
                                </div>
                                <div
                                    class="w-full flex justify-center items-center"
                                >
                                    <input
                                        type="checkbox"
                                        class="w-3 h-3"
                                        v-model="p.am"
                                    />
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
            headers: [
                "mp_id",
                "mp_name",
                "schedule_management",
                "create_mr",
                "read_mr",
                "patient_transfer",
                "access_management",
            ],
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            selected_events: [],
            api_url: "http://127.0.0.1:3000",
            mp: [
                {
                    id: "0123456789",
                    name: "sample",
                    sm: true,
                    cmr: false,
                    rmr: true,
                    pt: false,
                    am: true,
                },
                {
                    id: "21124475347",
                    name: "sample",
                    sm: false,
                    cmr: true,
                    rmr: false,
                    pt: true,
                    am: false,
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
