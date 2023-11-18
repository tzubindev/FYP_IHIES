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
                            <!-- Filter title -->
                            <div class="w-fit bg-gray rounded text-white px-2">
                                Filter
                            </div>

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
                                        class="h-full w-full p-2 bg-white shadow-inner border rounded border-gray/80 focus:outline-none"
                                        v-model="filter.mp_id_or_name"
                                    />
                                </div>
                                <div
                                    class="col-span-2 w-full border rounded border-gray/80"
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

                        <!-- Record Viewing Feature -->
                        <div
                            class="rounded w-full max-w-[1140px] mt-3 text-[12px] max-h-[500px] p-1 h-full overflow-y-auto"
                        >
                            <!-- Title -->
                            <div
                                class="w-full grid grid-cols-5 gap-1 text-center text-white static"
                            >
                                <div
                                    class="col-span-1 w-full bg-red font-semibold rounded p-1"
                                >
                                    Medical Personnel ID
                                </div>
                                <div
                                    class="col-span-2 w-full bg-red font-semibold rounded p-1"
                                >
                                    Medical Personnel Name
                                </div>
                                <div
                                    class="col-span-1 w-full bg-red font-semibold rounded p-1"
                                >
                                    Created on
                                </div>
                                <div
                                    class="w-full bg-red font-semibold rounded p-1"
                                >
                                    Action
                                </div>
                            </div>

                            <!-- Records -->
                            <div class="mt-2" v-for="r in records" :key="r.id">
                                <Card
                                    @click="selected_record = r"
                                    class="w-full grid grid-cols-5 gap-1 p-1 bg-white/80 shadow-lg"
                                >
                                    <div
                                        class="col-span-1 w-full h-full items-center justify-center flex gap-2"
                                    >
                                        <p>{{ r.mp_id }}</p>
                                    </div>
                                    <div
                                        class="col-span-2 w-full h-full items-center justify-center flex gap-2"
                                    >
                                        <p>{{ r.mp_name }}</p>
                                    </div>
                                    <div
                                        class="col-span-1 w-full flex items-center justify-center"
                                    >
                                        <p
                                            class="w-fit text-center text-[14px] rounded"
                                        >
                                            {{
                                                standardiseDate(
                                                    r.created_timestamp
                                                )
                                            }}
                                        </p>
                                    </div>
                                    <div
                                        class="w-full h-full flex justify-end pr-6 items-center"
                                    >
                                        <div class="w-1/2">
                                            <div>View</div>
                                        </div>
                                    </div>
                                </Card>
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
            selected_record: null,
            api_url: "http://127.0.0.1:3000",
            records: [
                {
                    mp_id: "12345678",
                    mp_name: "sample mp",
                    created_timestamp: 1700018917663,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "2345678",
                    mp_name: "sample mp 2",
                    created_timestamp: 1700018917663,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "7642391",
                    mp_name: "sample mp 3",
                    created_timestamp: 1700018917663,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "8901234",
                    mp_name: "sample mp 4",
                    created_timestamp: 1700018917663,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "5678123",
                    mp_name: "sample mp 5",
                    created_timestamp: 1678992000000,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "4321987",
                    mp_name: "sample mp 6",
                    created_timestamp: 1678992000000,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "1098765",
                    mp_name: "sample mp 7",
                    created_timestamp: 1678992000000,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
                                participants: [
                                    "Dr. Johnson",
                                    "Patient's Family",
                                ],
                            },
                        ],
                    },
                },
                {
                    mp_id: "3456789",
                    mp_name: "sample mp 8",
                    created_timestamp: 1678992000000,
                    record: {
                        doctor_clinical_notes: [
                            {
                                date: "2023-11-14",
                                note: "Patient presented with flu-like symptoms. Prescribed antibiotics.",
                            },
                            {
                                date: "2023-11-16",
                                note: "Follow-up visit. Symptoms improved. Advised rest and hydration.",
                            },
                        ],
                        discussion_recording: {
                            content: "Discussion content here",
                            witness: "Witness name",
                        },
                        referral_notes: [
                            {
                                date: "2023-11-14",
                                referringDoctor: "Dr. Smith",
                                specialist: "Cardiologist",
                                reason: "Suspected heart condition",
                            },
                            {
                                date: "2023-11-16",
                                referringDoctor: "Dr. Johnson",
                                specialist: "Orthopedic Surgeon",
                                reason: "Evaluation for joint surgery",
                            },
                        ],
                        lab_histopathological_reports: [
                            {
                                date: "2023-11-14",
                                testType: "Blood Test",
                                result: "Normal",
                                labTechnician: "Lab Tech A",
                            },
                            {
                                date: "2023-11-16",
                                testType: "Biopsy",
                                result: "Benign",
                                labTechnician: "Lab Tech B",
                            },
                        ],
                        imaging_records: [
                            {
                                url: "https://example.com/download/imaging_record_1.jpg",
                                description: "X-ray of the chest",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/imaging_record_2.png",
                                description: "MRI of the brain",
                                date: "2023-11-15",
                            },
                        ],
                        clinical_photographs: [
                            {
                                url: "https://example.com/download/clinical_photo_1.jpg",
                                description: "Before surgery",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/clinical_photo_2.png",
                                description: "After surgery",
                                date: "2023-11-16",
                            },
                        ],
                        drug_prescriptions: [
                            {
                                url: "https://example.com/download/prescription_1.pdf",
                                date: "2023-11-14",
                                prescribedBy: "Dr. Smith",
                            },
                            {
                                url: "https://example.com/download/prescription_2.pdf",
                                date: "2023-11-15",
                                prescribedBy: "Dr. Johnson",
                            },
                        ],
                        nurses_reports: [
                            {
                                url: "https://example.com/download/nurse_report_1.pdf",
                                date: "2023-11-14",
                                nurseName: "Nurse Amy",
                            },
                            {
                                url: "https://example.com/download/nurse_report_2.pdf",
                                date: "2023-11-16",
                                nurseName: "Nurse Bob",
                            },
                        ],
                        consent_forms: [
                            {
                                url: "https://example.com/download/consent_form_1.pdf",
                                date: "2023-11-14",
                                patientSignature: "John Doe",
                            },
                            {
                                url: "https://example.com/download/consent_form_2.pdf",
                                date: "2023-11-15",
                                patientSignature: "Jane Doe",
                            },
                        ],
                        at_own_risk_discharge_forms: [
                            {
                                url: "https://example.com/download/discharge_form_1.pdf",
                                date: "2023-11-14",
                                dischargeBy: "Dr. Johnson",
                            },
                            {
                                url: "https://example.com/download/discharge_form_2.pdf",
                                date: "2023-11-16",
                                dischargeBy: "Dr. Smith",
                            },
                        ],
                        operation_notes: [
                            {
                                url: "https://example.com/download/operation_note_1.pdf",
                                date: "2023-11-14",
                                surgeon: "Dr. Brown",
                            },
                            {
                                url: "https://example.com/download/operation_note_2.pdf",
                                date: "2023-11-15",
                                surgeon: "Dr. Davis",
                            },
                        ],
                        anaesthetic_notes: [
                            {
                                url: "https://example.com/download/anaesthetic_note_1.pdf",
                                date: "2023-11-14",
                                anaesthetist: "Dr. White",
                            },
                            {
                                url: "https://example.com/download/anaesthetic_note_2.pdf",
                                date: "2023-11-16",
                                anaesthetist: "Dr. Black",
                            },
                        ],
                        videoRecordings: [
                            {
                                url: "https://example.com/download/video_recording_1.mp4",
                                description: "Pre-surgery briefing",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/video_recording_2.mp4",
                                description: "Post-surgery recovery",
                                date: "2023-11-16",
                            },
                        ],
                        monitoring_equipment_printouts: [
                            {
                                url: "https://example.com/download/equipment_printout_1.pdf",
                                description: "Heart rate monitoring",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/equipment_printout_2.pdf",
                                description: "Blood pressure monitoring",
                                date: "2023-11-15",
                            },
                        ],
                        letters_to_and_from_health_professionals: [
                            {
                                url: "https://example.com/download/letter_1.pdf",
                                sender: "Dr. Smith",
                                recipient: "Patient",
                                date: "2023-11-14",
                            },
                            {
                                url: "https://example.com/download/letter_2.pdf",
                                sender: "Patient",
                                recipient: "Dr. Johnson",
                                date: "2023-11-15",
                            },
                        ],
                        telephone_consultation_recordings: [
                            {
                                url: "https://example.com/download/consultation_recording_1.mp3",
                                date: "2023-11-14",
                                participants: ["Dr. Smith", "Patient"],
                            },
                            {
                                url: "https://example.com/download/consultation_recording_2.mp3",
                                date: "2023-11-15",
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

            return `${day}/${month}/${year}`;
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
