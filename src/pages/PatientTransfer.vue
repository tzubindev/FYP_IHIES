<template>
    <!-- TRANSLATION -->
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-100 absolute w-full h-screen bg-black text-yellow flex justify-center items-center"
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
                            <p>{{ $t("patient_transfer") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full">
                        <div
                            class="w-full grid grid-cols-1 lg:grid-cols-3 lg:max-w-[1100px]"
                        >
                            <!-- Viewers -->
                            <div class="lg:col-span-2 text-[14px] pr-4">
                                <!-- Summary -->
                                <div class="w-full grid grid-cols-3 gap-2">
                                    <div
                                        class="flex items-center justify-between p-2 bg-gradient-to-br from-mintage to-darkgreen text-white"
                                    >
                                        <div
                                            class="bg-white/40 w-fit p-1 backdrop-blur-xl"
                                        >
                                            <img
                                                src="../assets/bed.svg"
                                                class="w-5 h-5"
                                            />
                                        </div>
                                        <p>Available Beds</p>

                                        <div class="text-[26px]">{{ 17 }}</div>
                                    </div>
                                    <div
                                        class="flex items-center justify-between p-2 bg-gradient-to-br from-red to-darkred text-white"
                                    >
                                        <div
                                            class="bg-white/40 w-fit p-1 backdrop-blur-xl"
                                        >
                                            <img
                                                src="../assets/transfer.svg"
                                                class="w-5 h-5"
                                            />
                                        </div>
                                        <p>Transferring</p>

                                        <div class="text-[26px]">{{ 2 }}</div>
                                    </div>
                                    <div
                                        class="flex items-center justify-between p-2 bg-gradient-to-br from-blue to-cool text-white"
                                    >
                                        <div
                                            class="bg-white/40 w-fit p-1 backdrop-blur-xl"
                                        >
                                            <img
                                                src="../assets/completed.svg"
                                                class="w-5 h-5"
                                            />
                                        </div>
                                        <p>Transferred</p>

                                        <div class="text-[26px]">{{ 6 }}</div>
                                    </div>
                                </div>

                                <!-- Viewer Tab -->
                                <div
                                    class="w-full border-b border-gray/30 mt-3 flex"
                                >
                                    <!-- Tabs -->
                                    <div
                                        class="w-fit transition cursor-pointer hover:bg-gray/10 p-2"
                                        :class="{
                                            'border-b-4 border-red':
                                                selected_tab === 0,
                                        }"
                                        @click="selected_tab = 0"
                                    >
                                        Available Beds
                                    </div>
                                    <div
                                        class="w-fit transition cursor-pointer hover:bg-gray/10 p-2"
                                        :class="{
                                            'border-b-4 border-red':
                                                selected_tab === 1,
                                        }"
                                        @click="selected_tab = 1"
                                    >
                                        Transferring
                                    </div>
                                </div>

                                <!--Viewer Body-->
                                <!-- Available beds -->
                                <Transition>
                                    <div v-if="selected_tab === 0" class="p-3">
                                        <!-- Manage bed button -->
                                        <div class="w-full flex justify-end">
                                            <div
                                                class="shadow shadow-gray cursor-pointer hover:bg-gray transition p-1 pl-1 pr-2 bg-cool text-white flex items-center gap-1"
                                            >
                                                <img
                                                    src="../assets/add.svg"
                                                    class="w-5 h-5"
                                                />
                                                <div>
                                                    {{ $t("manage_bed") }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Department-bed title -->
                                        <div
                                            class="border-b-2 px-2 border-gray/30 w-fit mb-2"
                                        >
                                            Accident and emergency (A&E)
                                        </div>

                                        <!-- Info blocks -->
                                        <div
                                            class="overflow-y-auto max-h-[500px] p-0.5"
                                        >
                                            <div
                                                class="mb-2 shadow shadow-gray p-2 py-2 grid grid-cols-4"
                                                v-for="(bed, index) in ane_beds"
                                                :key="index"
                                                :class="{
                                                    'bg-red text-white':
                                                        !bed.available,
                                                    'bg-green ': bed.available,
                                                }"
                                            >
                                                <!-- Bed info -->

                                                <div
                                                    class="flex items-center gap-2"
                                                >
                                                    <div
                                                        class="bg-gray text-white p-1 px-2"
                                                    >
                                                        Bed No
                                                    </div>
                                                    {{ bed.no }}
                                                </div>

                                                <div
                                                    class="flex items-center gap-2 col-span-2"
                                                >
                                                    <div
                                                        class="bg-gray text-white p-1 px-2"
                                                        v-if="!bed.available"
                                                    >
                                                        Patient ID
                                                    </div>
                                                    {{ bed.patient_id }}
                                                </div>

                                                <!-- Update bed info buttons -->
                                                <div class="text-center">
                                                    <div v-if="bed.available">
                                                        <div
                                                            class="bg-darkgreen p-2 py-1 text-white shadow shadow-gray cursor-pointer hover:bg-mintage/80 transition"
                                                        >
                                                            Place Patient
                                                        </div>
                                                    </div>
                                                    <div v-else>
                                                        <div
                                                            class="bg-gray p-2 py-1 text-white shadow shadow-gray cursor-pointer hover:bg-gray/80 transition"
                                                        >
                                                            Resolved
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Transferring -->
                                <Transition>
                                    <div
                                        v-if="selected_tab === 1"
                                        class="p-3 flex gap-0.5 flex-wrap"
                                    >
                                        <div
                                            class="grid grid-cols-4 w-full text-white text-center"
                                        >
                                            <div
                                                v-for="(
                                                    h, index
                                                ) in transferring_headers"
                                                :key="index"
                                                class="w-full bg-gray py-1"
                                            >
                                                <div
                                                    :class="{
                                                        'border-r border-white/50':
                                                            index !==
                                                            transferring_headers.length -
                                                                1,
                                                    }"
                                                >
                                                    {{ h }}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            v-for="(t, index) in transferring"
                                            :key="index"
                                            class="w-full bg-gray/30 grid grid-cols-4 p-1"
                                        >
                                            <div
                                                class="flex justify-center items-center p-1"
                                                v-for="(
                                                    v, index
                                                ) in Object.values(t)"
                                                :key="index"
                                            >
                                                {{ v }}
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Right status bar -->
                            <div
                                class="text-[12px] lg:border-l border-gray/20 h-full flex justify-start flex-col flex-wrap lg:pl-4"
                            >
                                <!-- Request Button -->
                                <div
                                    class="cursor-pointer hover:bg-red transition text-[16px] bg-darkred text-white flex p-2 justify-center items-center"
                                >
                                    Request Transfer
                                    <img
                                        src="../assets/request.svg"
                                        class="w-5 h-5 ml-2"
                                    />
                                </div>

                                <div
                                    class="mt-4 mb-1 flex text-center h-fit bg-gray w-full text-white py-1"
                                >
                                    <div class="grow">Transfer Request</div>
                                    <span
                                        class="relative flex h-3 w-3 -mt-2.5 -mr-1"
                                        v-if="request.length"
                                    >
                                        <span
                                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75"
                                        ></span>
                                        <span
                                            class="relative inline-flex rounded-full h-3 w-3 bg-red"
                                        ></span>
                                    </span>
                                </div>

                                <Transition name="fade">
                                    <div
                                        v-if="!request.length"
                                        class="bg-gray/80 p-2 flex justify-center text-white/60"
                                    >
                                        No Request
                                    </div>
                                </Transition>

                                <Transition name="fade">
                                    <div
                                        class="overflow-y-auto max-h-[600px] p-1"
                                        v-if="request.length"
                                    >
                                        <div
                                            class="hover:bg-gray transition cursor-pointer grid grid-cols-2 gap-2 ursor-pointer mb-1 p-1 text-[12px] text-white text-left bg-gray/70 slide-in-left-to-right"
                                            v-for="(r, index) in request"
                                            :key="index"
                                            :style="{
                                                'animation-delay': `${
                                                    0.1 + index * 0.2
                                                }s`,
                                            }"
                                        >
                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>Request ID:</strong>
                                                <div class="text-yellow ml-2">
                                                    {{ r.request_id }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>From:</strong>
                                                <div class="text-yellow ml-2">
                                                    {{ r.from }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong>Patient ID:</strong>
                                                <div class="text-yellow ml-2">
                                                    {{ r.patient_id }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-between backdrop-blur p-2 py-1 border-b border-white/20"
                                            >
                                                <strong
                                                    >Current Condition:</strong
                                                >
                                                <div class="text-yellow ml-2">
                                                    {{ r.current_condition }}
                                                </div>
                                            </div>

                                            <div
                                                class="backdrop-blur p-2 py-1 col-span-2"
                                            >
                                                <strong>
                                                    Reason for Transfer:
                                                </strong>
                                                <div
                                                    class="text-yellow text-right"
                                                >
                                                    {{
                                                        r.additional_info
                                                            .reason_for_transfer
                                                    }}
                                                </div>

                                                <strong class="italic">
                                                    Note:
                                                </strong>
                                                <div
                                                    class="italic text-yellow text-right"
                                                >
                                                    {{ r.additional_info.note }}
                                                </div>
                                            </div>
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
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            selected_events: [],
            selected_tab: 0,
            api_url: "http://127.0.0.1:3000",
            records: [],
            transferring: [
                {
                    name: "Name 1",
                    id: "Name 1 ID",
                    from: "Sample hospital 1",
                    since: new Date().toISOString(),
                },
                {
                    name: "Name 2",
                    id: "Name 2 ID",
                    from: "Sample hospital 2",
                    since: new Date().toISOString(),
                },
                {
                    name: "Name 3",
                    id: "Name 3 ID",
                    from: "Sample hospital 3",
                    since: new Date().toISOString(),
                },
                {
                    name: "Name 4",
                    id: "Name 4 ID",
                    from: "Sample hospital 4",
                    since: new Date().toISOString(),
                },
                {
                    name: "Name 5",
                    id: "Name 5 ID",

                    from: "Sample hospital 5",
                    since: new Date().toISOString(),
                },
                {
                    name: "Name 6",
                    id: "Name 6 ID",

                    from: "Sample hospital 6",
                    since: new Date().toISOString(),
                },
                {
                    name: "Name 7",
                    id: "Name 7 ID",

                    from: "Sample hospital 7",
                    since: new Date().toISOString(),
                },
            ],
            transferring_headers: ["name", "id", "from", "since"],
            request: [
                {
                    request_id: 1,
                    from: "Hospital A",
                    patient_id: "2465798462",
                    current_condition: "Stable",
                    additional_info: {
                        reason_for_transfer: "Specialized Treatment Required",
                        note: "Patient has a history of heart disease. Currently taking Aspirin and Beta-blockers.",
                    },
                },
                {
                    request_id: 2,
                    from: "Hospital B",
                    patient_id: "9876543210",
                    current_condition: "Critical",
                    additional_info: {
                        reason_for_transfer: "Emergency Surgery Required",
                        note: "Severe abdominal pain reported. Urgent surgery needed.",
                    },
                },
                {
                    request_id: 3,
                    from: "Hospital C",
                    patient_id: "123456789",
                    current_condition: "Serious",
                    additional_info: {
                        reason_for_transfer: "Oncology Consultation",
                        note: "Suspected cancer diagnosis. Requires further evaluation by oncology specialist.",
                    },
                },
            ],
            ane_beds: [
                { no: 1, available: false, patient_id: "123456789" },
                { no: 2, available: true, patient_id: null },
                { no: 3, available: true, patient_id: null },
                { no: 4, available: false, patient_id: "1357968842" },
                { no: 5, available: true, patient_id: null },
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
