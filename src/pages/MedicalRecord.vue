<template>
    <!-- TRANSLATION -->

    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <!-- Access denied -->
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

            <!-- Medical Record -->
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
                            <p>{{ $t("medical_record") }}</p>
                        </div>
                    </div>

                    <div class="h-fit w-full p-2 flex justify-center flex-wrap">
                        <!-- Filter Feature -->
                        <div
                            class="w-full max-w-[1140px] pb-4 border-b border-gray/20"
                        >
                            <!-- Filter area -->
                            <!-- mpid/mp name (medical personnel) |  | date -->
                            <div
                                class="mt-2 grid grid-cols-5 gap-2 text-[12px] p-1"
                            >
                                <div class="col-span-2 w-full">
                                    Medical Personnel ID / Name
                                </div>
                                <div class="col-span-2 w-full">Date</div>
                            </div>
                            <div class="grid grid-cols-5 gap-1 h-[40px]">
                                <div class="col-span-2 w-full">
                                    <input
                                        type="text"
                                        class="h-full w-full p-2 bg-white shadow-inner border border-gray/80 focus:outline-none"
                                        v-model="filter.mp_id_or_name"
                                    />
                                </div>
                                <div
                                    class="col-span-2 w-full border border-gray/80"
                                >
                                    <VueDatePicker
                                        v-model="filter.date"
                                        :enable-time-picker="false"
                                    />
                                </div>
                                <Button
                                    title="Search"
                                    customClass="text-center bg-gray/70 hover:bg-gray/90 text-white shadow"
                                    medium
                                ></Button>
                            </div>
                        </div>

                        <!-- Record Selection -->
                        <div
                            class="w-full max-w-[1140px] mt-2 text-[12px] max-h-[280px] pb-3 border-b border-gray/20"
                        >
                            <!-- Record Bar -->

                            <div
                                class="font-sans w-full h-full overflow-y-auto p-2 pl-0"
                            >
                                <!-- Reminder -->
                                <p class="italic text-right mb-0.5">
                                    *MP = Medical Personnel
                                </p>

                                <!-- Title -->
                                <div
                                    class="w-full grid grid-cols-4 text-center text-white bg-red mb-1"
                                >
                                    <div
                                        class="flex items-center justify-center w-full font-semibold p-1"
                                    >
                                        MP ID
                                    </div>
                                    <div
                                        class="flex items-center justify-center col-span-2 w-full font-semibold p-1"
                                    >
                                        MP Name
                                    </div>
                                    <div
                                        class="flex items-center justify-center w-full font-semibold p-1"
                                    >
                                        Created on
                                    </div>
                                </div>

                                <!-- Records -->
                                <div>
                                    <Card
                                        @click="openRecord(r)"
                                        class="text-[11px] -none w-full grid grid-cols-4 gap-1 p-1 bg-white/90 border border-b-0 border-gray/20"
                                        v-for="r in records"
                                        :key="r.id"
                                    >
                                        <div
                                            class="col-span-1 w-full h-full items-center justify-center flex gap-2 border-r border-gray/20"
                                        >
                                            <p class="font-semibold">
                                                {{ r.mp_id }}
                                            </p>
                                        </div>
                                        <div
                                            class="col-span-2 w-full h-full items-center justify-center flex gap-2 border-r border-gray/20"
                                        >
                                            <p>{{ r.mp_name }}</p>
                                        </div>
                                        <div
                                            class="col-span-1 w-full flex items-center justify-center"
                                        >
                                            <p>
                                                {{
                                                    standardiseDate(
                                                        r.created_timestamp
                                                    )
                                                }}
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>

                        <!-- Record View Panel  -->
                        <div
                            class="font-sans w-full max-w-[1140px] mt-3 text-[12px] pb-3 border-b border-gray/20"
                        >
                            <div class="w-full h-fit grid grid-cols-5">
                                <!-- Directory Tree -->
                                <Transition>
                                    <div
                                        class="col-span-2 pb-3 max-h-[400px] overflow-y-auto bg-gray/90"
                                        v-if="selected_record"
                                    >
                                        <!-- Tree title -->
                                        <div
                                            class="bg-gray text-white w-full flex justify-between p-2"
                                        >
                                            <p class="">Record Details</p>
                                            <div
                                                class="bg-red px-2 cursor-pointer"
                                                @click="clearRecord"
                                            >
                                                Close
                                            </div>
                                        </div>

                                        <!-- Tree bar -->
                                        <div class="">
                                            <details
                                                v-for="(
                                                    record, recordKey
                                                ) in selected_record.record"
                                                :key="recordKey"
                                                class="text-[11px] pb-0.5 text-white w-full"
                                            >
                                                <summary
                                                    class="px-3 truncate hover:bg-white/20 cursor-pointer transition"
                                                    :title="
                                                        standardiseString(
                                                            recordKey
                                                        )
                                                    "
                                                >
                                                    &#128193;
                                                    {{
                                                        standardiseString(
                                                            recordKey
                                                        )
                                                    }}
                                                </summary>
                                                <div
                                                    class="flex pl-9 hover:bg-white/20 cursor-pointer transition"
                                                    v-for="recordItem in record"
                                                    :key="recordItem.id"
                                                    @click="
                                                        selected_record_item =
                                                            recordItem
                                                    "
                                                >
                                                    📄
                                                    {{
                                                        createViewFileID(
                                                            recordKey,
                                                            recordItem.timestamp
                                                        )
                                                    }}
                                                </div>
                                            </details>
                                        </div>

                                        <!-- Select a record animation -->
                                    </div></Transition
                                >

                                <!-- View panel -->
                                <Transition>
                                    <div
                                        class="p-4 col-span-3 bg-gray/80 text-white overflow-y-auto"
                                        v-if="selected_record"
                                    >
                                        <!-- View Panel Title -->
                                        <div
                                            class="justify-center p-1 px-3 font-bold text-md flex items-center w-full bg-[#fcd53f] text-gray"
                                        >
                                            <div class="px-1 mr-2 bg-white/70">
                                                Record
                                            </div>
                                            {{ selected_record.mp_id }}_
                                            {{ selected_record.mp_name }}_{{
                                                selected_record.created_timestamp
                                            }}
                                        </div>

                                        <!-- View panel data -->
                                        <div
                                            v-for="(
                                                value, key, index
                                            ) in selected_record_item"
                                            :key="index"
                                            class="w-full grid grid-cols-4 gap-2 py-2 border-b border-white/40"
                                        >
                                            <!-- Data Name -->
                                            <div
                                                class="w-full bg-white/30 text-white items-center text-center justify-center flex py-1 font-semibold"
                                            >
                                                {{ standardiseString(key) }}
                                            </div>

                                            <!-- Data Value -->
                                            <div
                                                class="col-span-3 flex items-center"
                                                v-if="key === 'url'"
                                            >
                                                <!-- Non-array data -->
                                                <div
                                                    class="flex w-full"
                                                    v-if="!Array.isArray(value)"
                                                >
                                                    <a
                                                        class="truncate h-fit hover:underline cursor-pointer transition hover:text-red"
                                                        :href="value"
                                                        target="_blank"
                                                        :title="value"
                                                    >
                                                        {{ value }}
                                                    </a>
                                                    <img
                                                        class="w-5 h-4 ml-0.5 mt-0.5"
                                                        src="https://img.icons8.com/ios/50/ffffff/open-in-popup.png"
                                                        alt="open-in-popup"
                                                    />
                                                </div>
                                                <!-- array data -->
                                                <div
                                                    v-else
                                                    class="w-full grid grid-cols-1 gap-1"
                                                >
                                                    <div
                                                        class="w-full flex items-center"
                                                        v-for="v in value"
                                                        :key="v"
                                                    >
                                                        <a
                                                            class="truncate h-fit hover:underline cursor-pointer transition hover:text-red"
                                                            :href="v"
                                                            target="_blank"
                                                            :title="v"
                                                        >
                                                            {{ v }}
                                                        </a>
                                                        <img
                                                            class="w-5 h-4 ml-0.5 mt-0.5"
                                                            src="https://img.icons8.com/ios/50/ffffff/open-in-popup.png"
                                                            alt="open-in-popup"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                v-else
                                                class="col-span-3 flex items-center"
                                            >
                                                <!-- None Array data value -->
                                                <div
                                                    v-if="!Array.isArray(value)"
                                                >
                                                    {{ value }}
                                                </div>

                                                <!-- Array data value -->
                                                <div v-else class="flex gap-2">
                                                    <div
                                                        class="bg-blue p-0.5 px-3"
                                                        v-for="v in value"
                                                        :key="v"
                                                    >
                                                        {{ v }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div></Transition
                                >

                                <!-- No data message -->
                                <div
                                    v-if="!selected_record"
                                    class="flex justify-center items-center h-20 w-full bg-white col-span-5 shadow shadow-gray/50"
                                >
                                    No Record Is Selected
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
            filter: {
                date: null,
                mp_id_or_name: null,
            },

            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            is_record_modal_open: false,
            is_record_bar_expanding: false,
            selected_record: null,
            selected_record_item: null,
            api_url: "http://127.0.0.1:3000",
            records: [
                {
                    mp_id: "12345678",
                    mp_name: "sample mp",
                    created_timestamp: 1700018917663,
                    record: {
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
                        referral_notes: [
                            {
                                timestamp: "2023-11-14",
                                referring_doctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                timestamp: "2023-11-16",
                                referring_doctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                timestamp: "2023-11-14",
                                test_type: "Blood Test",
                                result: "Normal",
                                lab_technician: "Lab Tech A",
                            },
                            {
                                timestamp: "2023-11-16",
                                test_type: "Biopsy",
                                result: "Benign",
                                lab_technician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                timestamp: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                timestamp: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                timestamp: "2023-11-14",
                                prescribed_by: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                timestamp: "2023-11-15",
                                prescribed_by: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                timestamp: "2023-11-14",
                                nurse_name: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                timestamp: "2023-11-16",
                                nurse_name: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                timestamp: "2023-11-14",
                                patient_signature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                timestamp: "2023-11-15",
                                patient_signature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                timestamp: "2023-11-14",
                                discharge_by: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                timestamp: "2023-11-16",
                                discharge_by: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                timestamp: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                timestamp: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                timestamp: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                timestamp: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        video_recordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                timestamp: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                timestamp: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                timestamp: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                timestamp: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                timestamp: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "6508102616",
                    mp_name: "sample mp",
                    created_timestamp: 1700018917663,
                    record: {
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
                        referral_notes: [
                            {
                                timestamp: "2023-11-14",
                                referring_doctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                timestamp: "2023-11-16",
                                referring_doctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                timestamp: "2023-11-14",
                                test_type: "Blood Test",
                                result: "Normal",
                                lab_technician: "Lab Tech A",
                            },
                            {
                                timestamp: "2023-11-16",
                                test_type: "Biopsy",
                                result: "Benign",
                                lab_technician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: [
                                    "https://example.com/download/imaging_record_1.jpg",
                                    "https://example.com/download/imaging_record_3.jpg",
                                ],
                                description: "X-ray of the chest",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                timestamp: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                timestamp: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                timestamp: "2023-11-14",
                                prescribed_by: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                timestamp: "2023-11-15",
                                prescribed_by: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                timestamp: "2023-11-14",
                                nurse_name: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                timestamp: "2023-11-16",
                                nurse_name: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                timestamp: "2023-11-14",
                                patient_signature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                timestamp: "2023-11-15",
                                patient_signature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                timestamp: "2023-11-14",
                                discharge_by: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                timestamp: "2023-11-16",
                                discharge_by: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                timestamp: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                timestamp: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                timestamp: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                timestamp: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        video_recordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                timestamp: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                timestamp: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                timestamp: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                timestamp: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                timestamp: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                timestamp: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
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
        // specifc format to specific formatted date
        standardiseDate(timestamp) {
            const dateObject = new Date(timestamp);
            const day = String(dateObject.getDate()).padStart(2, "0");
            const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Months are zero-based
            const year = dateObject.getFullYear();
            const hours = String(dateObject.getHours()).padStart(2, "0");
            const minutes = String(dateObject.getMinutes()).padStart(2, "0");

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        },
        standardiseString(title) {
            return title
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        },
        openRecord(r) {
            this.selected_record = r;
            this.is_record_modal_open = true;
        },
        updateModal(v) {
            this.is_record_modal_open = v;
        },
        toggleRecordBar() {
            this.is_record_bar_expanding = !this.is_record_bar_expanding;
        },
        createViewFileID(infoType, timestamp) {
            return `${infoType
                .split("_")
                .map((w) => w.charAt(0))
                .join("")}_${new Date(timestamp)
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "")}`;
        },
        clearRecord() {
            this.selected_record = null;
            this.selected_record_item = null;
        },
    },
};
</script>

<style>
.resize-y {
    resize: vertical; /* Allow vertical resizing */
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
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
