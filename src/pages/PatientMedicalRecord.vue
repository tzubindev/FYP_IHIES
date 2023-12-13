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
                            <p>{{ $t("patient_medical_record") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full">
                        <div
                            class="w-full lg:max-w-[950px] p-2 flex flex-wrap gap-1"
                        >
                            <!-- Add file Area Drag and drop-->

                            <!-- Choose Patient -->
                            <!-- Title -->
                            <div class="text-[16px]">
                                {{ $t("patient") }}
                            </div>

                            <!-- Patient Listing -->
                            <div
                                class="resize-y overflow-y-auto min-h-[60px] h-24 bg-gray/10 w-full shadow shadow-gray/50"
                            >
                                <!-- Search bar -->
                                <div
                                    class="w-full p-2 flex justify-end gap-2 items-center h-[50px]"
                                >
                                    <input
                                        type="text"
                                        class="h-full items-center flex px-3 p-0.5 text-[16px] focus:outline-none text-gray/70 shadow shadow-gray/50"
                                        placeholder="Patient ID"
                                    />

                                    <div
                                        class="cursor-pointer hover:bg-gray/60 transition h-full items-center flex px-3 p-0.5 text-white text-[16px] bg-gray shadow shadow-gray/50"
                                    >
                                        {{ $t("search") }}
                                    </div>
                                </div>

                                <!-- patient row -->
                                <div class="w-full"></div>
                            </div>

                            <!-- Choose Document Type refer to patient side  -->
                            <div class="mt-4 grid grid-cols-2 gap-2 w-full">
                                <div class="flex flex-wrap gap-1">
                                    <!-- Title -->
                                    <div class="text-[16px]">
                                        {{ $t("document_type") }}
                                    </div>

                                    <!-- Nr * 2c -->
                                    <div class="grid grid-cols-2 gap-2 w-full">
                                        <div
                                            class="w-full flex justify-between items-center hover:bg-gray/30 cursor-pointer transition bg-gray/10 shadow shadow-gray/50 pl-1.5 pr-2 p-1 text-[12px]"
                                            v-for="(t, index) in record_type"
                                            :key="index"
                                        >
                                            <img
                                                src="../assets/document.svg"
                                                class="w-5 h-5"
                                            />
                                            <!-- At least 2 unit gap -->
                                            <div class="w-2"></div>
                                            <div
                                                class="truncate text-gray h-full flex items-center"
                                            >
                                                {{ t }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-1">
                                    <!-- Title -->
                                    <div class="text-[16px] h-fit">
                                        {{ $t("document_list") }}
                                    </div>

                                    <div class="bg-gray/10 w-full h-fit"></div>
                                </div>
                            </div>

                            <!-- List Documents -->

                            <div class="text-[16px] w-full mt-4">
                                {{ $t("document_viewer") }}
                            </div>
                            <DocumentViewer
                                class="flex justify-center flex-wrap w-full resize-y bg-gray/10 h-[500px] min-h-[500px] max-h-[800px] overflow-hidden p-2 pt-10"
                                source="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
                            ></DocumentViewer>
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
            record_type: ["doctor_clinical_notes", "discussion_recording"],
            record: [
                {
                    doctor_clinical_notes: [
                        {
                            timestamp: "2023-11-14",
                            note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                        },
                        {
                            timestamp: "2023-11-16",
                            note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                        },
                    ],
                    discussion_recording: [
                        {
                            content: "Discussion content here",
                            witness: "Witness name",
                            timestamp: "2023-11-14",
                        },
                    ],
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
        updateSelectedNotification() {},
    },
};
</script>

<style></style>
