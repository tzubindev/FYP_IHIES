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
                            <p>{{ $t("schedule_management") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full min-w-[700px]">
                        <div class="w-full lg:max-w-[950px] flex flex-wrap p-2">
                            <!-- Summary span -->
                            <div class="w-full grid grid-cols-3 gap-2">
                                <!-- Incoming -->
                                <div
                                    class="w-full flex justify-center items-center flex-wrap bg-darkred p-2 text-white"
                                >
                                    <p>{{ "0" }}</p>
                                    <p class="w-full text-center">
                                        {{ $t("incoming") }}
                                    </p>
                                </div>

                                <!-- Completed -->
                                <div
                                    class="w-full flex justify-center items-center flex-wrap bg-darkgreen p-2 text-white"
                                >
                                    <p>{{ "0" }}</p>
                                    <p class="w-full text-center">
                                        {{ $t("completed") }}
                                    </p>
                                </div>

                                <!-- Cancelled -->
                                <div
                                    class="w-full flex justify-center items-center flex-wrap bg-darkyellow p-2 text-white"
                                >
                                    <p>{{ "0" }}</p>
                                    <p class="w-full text-center">
                                        {{ $t("cancelled") }}
                                    </p>
                                </div>
                            </div>

                            <div class="w-full flex justify-end mt-2">
                                <div
                                    class="hover:bg-darkred transition cursor-pointer flex gap-2 items-center text-[16px] bg-red p-1 px-2 text-white shadow shadow-gray"
                                >
                                    <img
                                        src="../assets/schedule.svg"
                                        class="w-5 h-5"
                                    />
                                    {{ $t("schedule") }}
                                </div>
                            </div>

                            <!-- Viewer Tabs -->
                            <div
                                class="text-gray/60 w-full flex text-[14px] gap-2 mt-2 border-b border-gray/40"
                            >
                                <div
                                    class="hover:bg-gray/10 cursor-pointer p-1 px-2"
                                    v-for="t in tabs"
                                    :key="t.id"
                                    :class="{
                                        'border-b-4 border-red text-gray':
                                            selected_tab === t,
                                    }"
                                    @click="selected_tab = t"
                                >
                                    {{ $t(t) }}
                                </div>
                            </div>

                            <!-- Schedule Viewer body -->
                            <Transition>
                                <div
                                    class="w-full"
                                    v-if="selected_tab === 'incoming'"
                                >
                                    <!-- Table Headers -->
                                    <div
                                        class="w-full grid grid-cols-4 text-[14px] my-2 bg-gray text-white"
                                    >
                                        <div
                                            v-for="(
                                                h, index
                                            ) in incoming_headers"
                                            :key="index"
                                            class="text-center py-1"
                                            :class="{
                                                'col-span-2':
                                                    index ===
                                                    incoming_headers.length - 1,
                                            }"
                                        >
                                            <div
                                                :class="{
                                                    'border-r border-white/60':
                                                        index !==
                                                        incoming_headers.length -
                                                            1,
                                                }"
                                            >
                                                {{ $t(h) }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table Body -->
                                    <div
                                        class="hover:bg-gray/10 transition cursor-pointer slide-in-left-to-right border w-full grid grid-cols-4 text-[14px] py-1 text-center"
                                        v-for="(h, index) in incoming_schedules"
                                        :key="index"
                                        :class="{
                                            'border-b-0':
                                                index !==
                                                incoming_schedules.length - 1,
                                        }"
                                        :style="{
                                            'animation-delay': `${
                                                0.1 + index * 0.2
                                            }s`,
                                        }"
                                    >
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.id }}
                                        </div>
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.name }}
                                        </div>
                                        <div
                                            class="col-span-2 w-full flex justify-center"
                                        >
                                            <div
                                                class="flex justify-center items-center gap-2 p-1 w-1/2"
                                            >
                                                <div
                                                    class="border-r pr-2 border-gray/70 hover:text-darkyellow transition hover:underline"
                                                >
                                                    {{ $t("cancel") }}
                                                </div>
                                                <div
                                                    class="border-r pr-2 border-gray/70 hover:text-darkgreen transition hover:underline"
                                                >
                                                    {{ $t("complete") }}
                                                </div>
                                                <div
                                                    class="hover:text-red transition hover:underline"
                                                >
                                                    {{ $t("reschedule") }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Pending Viewer body -->
                            <Transition>
                                <div
                                    class="w-full"
                                    v-if="selected_tab === 'pending'"
                                >
                                    <!-- Table Headers -->
                                    <div
                                        class="w-full grid grid-cols-6 text-[14px] my-2 bg-gray text-white"
                                    >
                                        <div
                                            v-for="(
                                                h, index
                                            ) in pending_headers"
                                            :key="index"
                                            class="text-center py-1"
                                            :class="{
                                                'col-span-2':
                                                    index ===
                                                    pending_headers.length - 1,
                                            }"
                                        >
                                            <div
                                                :class="{
                                                    'border-r border-white/60':
                                                        index !==
                                                        pending_headers.length -
                                                            1,
                                                }"
                                            >
                                                {{ $t(h) }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table Body -->
                                    <div
                                        class="hover:bg-gray/10 transition cursor-pointer slide-in-left-to-right border w-full grid grid-cols-6 text-[14px] py-1 text-center"
                                        v-for="(h, index) in pending_schedules"
                                        :key="index"
                                        :class="{
                                            'border-b-0':
                                                index !==
                                                incoming_schedules.length - 1,
                                        }"
                                        :style="{
                                            'animation-delay': `${
                                                0.1 + index * 0.2
                                            }s`,
                                        }"
                                    >
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.id }}
                                        </div>
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.department }}
                                        </div>
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.date }}
                                        </div>
                                        <div class="w-full flex justify-center">
                                            <div
                                                class="w-fit h-full bg-gray text-white px-3 p-1 transition hover:bg-black"
                                                @click="
                                                    openSymptomsModal(
                                                        h.symptoms
                                                    )
                                                "
                                            >
                                                {{ $t("view") }}
                                            </div>
                                        </div>
                                        <div
                                            class="col-span-2 w-full flex justify-center"
                                        >
                                            <div
                                                class="text-gray flex justify-center items-center gap-2 p-1 w-1/2"
                                            >
                                                <div
                                                    class="border-r border-gray/70 pr-2 hover:text-red transition hover:underline"
                                                >
                                                    {{ $t("deny") }}
                                                </div>
                                                <div
                                                    class="hover:text-darkgreen transition hover:underline"
                                                >
                                                    {{ $t("confirm") }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Symptoms Modal -->
            <Modal
                v-if="is_symptoms_shown"
                title="symptoms"
                modalType="info"
                noCancelButton
                @confirm="closeSymptomsModal"
            >
                <div class="w-full flex flex-wrap gap-1 mb-10">
                    <div
                        class="w-full bg-white/20 text-center"
                        v-for="s in selected_symptoms"
                        :key="s.id"
                    >
                        {{ $t(s) }}
                    </div>
                </div>
            </Modal>
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
            is_symptoms_shown: false,
            selected_events: [],
            selected_tab: "incoming",
            view_symptoms: null,
            api_url: "http://127.0.0.1:3000",
            records: [],
            tabs: ["incoming", "pending"],
            incoming_headers: ["patient_id", "patient_name", "action"],
            pending_headers: [
                "patient_id",
                "department",
                "date",
                "symptoms",
                "action",
            ],
            incoming_schedules: [
                { id: "01234553", name: "sample" },
                { id: "01234553", name: "sample2" },
            ],
            pending_schedules: [
                {
                    id: "01234553",
                    department: "dep1",
                    date: "sample",
                    symptoms: ["s1", "s2"],
                },
                {
                    id: "01234553",
                    department: "dep2",
                    date: "sample2",
                    symptoms: ["s3", "s4"],
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
        closeSymptomsModal() {
            this.is_symptoms_shown = false;
            this.selected_symptoms = null;
        },
        openSymptomsModal(s) {
            this.is_symptoms_shown = true;
            this.selected_symptoms = s;
        },
    },
};
</script>

<style></style>
