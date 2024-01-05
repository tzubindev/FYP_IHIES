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
                            <p>{{ $t("patient_medical_record") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full">
                        <div
                            class="w-full lg:max-w-[950px] p-2 flex flex-wrap gap-1"
                        >
                            <!-- Add record title-->
                            <div class="text-[16px] w-full">
                                {{ $t("add_record") }}
                            </div>

                            <!-- Drag and drop -->
                            <div class="w-full">
                                <div
                                    class="p-3 bg-gray/10 border border-gray/20 shadow shadow-gray/30"
                                    @dragover="dragover"
                                    @dragleave="dragleave"
                                    @drop="drop"
                                >
                                    <input
                                        type="file"
                                        multiple
                                        name="fields[assetsFieldHandle][]"
                                        id="assetsFieldHandle"
                                        class="w-px h-px opacity-0 overflow-hidden absolute"
                                        @change="onChange"
                                        ref="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />

                                    <label
                                        for="assetsFieldHandle"
                                        class="flex flex-wrap justify-center"
                                        v-if="!filelist.length"
                                    >
                                        <div class="p-2 bg-white/0 shadow">
                                            <img
                                                src="../assets/upload.svg"
                                                class="w-6 h-6"
                                            />
                                        </div>
                                        <div
                                            class="text-[14px] text-center text-gray w-full mt-1"
                                        >
                                            {{ $t("drop_files_in_here") }}
                                            <p>{{ $t("or") }}</p>
                                            <span
                                                class="underline cursor-pointer"
                                                >{{ $t("click_here") }}</span
                                            >
                                        </div>
                                    </label>
                                    <div
                                        v-if="this.filelist.length"
                                        class="flex flex-wrap justify-center gap-0.5 items-center max-h-[200px] overflow-y-auto px-1"
                                    >
                                        <div
                                            class="gap-1 cursor-pointer hover:bg-gray/80 bg-gray transition text-white text-[11px] py-1 border-b border-gray/30 w-full grid grid-cols-12"
                                            v-for="file in filelist"
                                            :key="file.id"
                                        >
                                            <!-- Icons group -->

                                            <div>
                                                <img
                                                    src="../assets/pdf.png"
                                                    v-if="
                                                        isFileType(
                                                            file.type,
                                                            'pdf'
                                                        )
                                                    "
                                                    class="w-6 h-6 mx-auto"
                                                />
                                                <img
                                                    src="../assets/imagefile.png"
                                                    v-if="
                                                        isFileType(
                                                            file.type,
                                                            'png'
                                                        ) ||
                                                        isFileType(
                                                            file.type,
                                                            'jpeg'
                                                        ) ||
                                                        isFileType(
                                                            file.type,
                                                            'jpg'
                                                        )
                                                    "
                                                    class="w-6 h-6 mr-1 ml-auto"
                                                />
                                                <img
                                                    src="../assets/wordfile.png"
                                                    v-if="
                                                        isFileType(
                                                            file.type,
                                                            'docx'
                                                        )
                                                    "
                                                    class="w-6 h-6 mr-1 ml-auto"
                                                />
                                                <img
                                                    src="../assets/file.png"
                                                    v-if="
                                                        isFileType(
                                                            file.type,
                                                            null
                                                        )
                                                    "
                                                    class="w-6 h-6 mr-1 ml-auto"
                                                />
                                            </div>

                                            <!-- Name -->
                                            <div
                                                class="col-span-6 flex justify-left items-center truncate w-full"
                                            >
                                                {{ file.name }}
                                            </div>

                                            <!-- Last Modified Date -->
                                            <div
                                                class="col-span-2 flex justify-center items-center truncate"
                                            >
                                                {{
                                                    format(
                                                        "date",
                                                        file.lastModified
                                                    )
                                                }}
                                            </div>

                                            <!-- File Size -->
                                            <div
                                                class="col-span-2 flex justify-center items-center truncate"
                                            >
                                                {{
                                                    format(
                                                        "filesize",
                                                        null,
                                                        file.size
                                                    )
                                                }}
                                            </div>

                                            <button
                                                type="button"
                                                @click="
                                                    remove(
                                                        filelist.indexOf(file)
                                                    )
                                                "
                                                title="Remove file"
                                                class="hover:bg-darkred bg-red p-2 py-0.5 transition w-fit h-full ml-auto mr-1"
                                            >
                                                &#x0058;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Upload button -->
                            <Transition>
                                <div
                                    v-if="filelist.length"
                                    class="w-full flex justify-end mt-1"
                                >
                                    <div
                                        class="cursor-pointer transition hover:bg-darkred flex items-center gap-1 bg-red shadow shadow-gray text-white px-2 py-1"
                                        @click="upload"
                                    >
                                        <img
                                            src="../assets/upload_white.svg"
                                            class="w-4 h-4"
                                        />
                                        <p class="text-[16px]">
                                            {{ $t("upload") }}
                                        </p>
                                    </div>
                                </div>
                            </Transition>

                            <!-- Seperate Line -->
                            <div
                                class="w-full border-b border-gray/40 my-2"
                            ></div>

                            <!-- filter Patient -->
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
                                        class="placeholder:text-gray/80 bg-white/80 h-full items-center flex px-3 p-0.5 text-[16px] focus:outline-none text-gray shadow shadow-gray/50"
                                        placeholder="Patient ID"
                                    />
                                </div>

                                <!-- patient row -->
                                <div class="w-full grid grid-cols-2 gap-2 p-2">
                                    <div
                                        class="hover:bg-cool transition cursor-pointer bg-gray text-white w-full h-full p-1 text-[16px] text-center"
                                        v-for="p in patients"
                                        :key="p.id"
                                        @click="selectPatient(p.id)"
                                        :class="{
                                            'bg-red hover:bg-darkred':
                                                selected_patient_id === p.id,
                                        }"
                                    >
                                        {{ p.id }} || {{ p.name }}
                                    </div>
                                </div>
                            </div>

                            <!-- Choose Document Type and Exact Document  -->
                            <div class="mt-4 grid grid-cols-2 gap-2 w-full">
                                <div
                                    class="flex flex-wrap gap-1 bg-gray/10 p-2 shadow shadow-gray"
                                >
                                    <!-- Title -->
                                    <div class="text-[16px]">
                                        {{ $t("document_type") }}
                                    </div>

                                    <!-- Nr * 2c -->
                                    <div
                                        class="grid grid-cols-2 gap-2 w-full"
                                        v-if="record_type.length"
                                    >
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

                            <!-- Document Viewer -->
                            <div class="text-[16px] w-full mt-4">
                                {{ $t("document_viewer") }}
                            </div>
                            <DocumentViewer
                                class="flex justify-center flex-wrap w-full resize-y bg-gray/10 h-[500px] min-h-[500px] max-h-[800px] overflow-hidden p-2 pt-10"
                                src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
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
            selected_patient_id: null,
            filelist: [],
            patients: null,
        };
    },
    async created() {
        console.log("CREATED");
        this.user.passcode = await sessionStorage.getItem("passcode");
        const user = await JSON.parse(sessionStorage.getItem("user"));
        this.user.id = user.id;
        this.user.role = user.role;
        await this.fetch();
    },

    methods: {
        selectPatient(id) {
            this.selected_patient_id =
                this.selected_patient_id === id ? null : id;
        },
        async fetch() {
            const response = await this.axios.get(this.api_url + "/patients", {
                headers: {
                    Authorization: this.user.passcode,
                },
            });

            this.patients = response.data.message;
            console.log(this.patients);
        },
        isFileType(fileType, expectedType) {
            const extension = fileType.split("/")[1];
            if (expectedType) return extension === expectedType;
            else {
                if (
                    !extension ||
                    !["png", "jpeg", "jpg", "pdf"].includes(extension)
                )
                    return true;
            }
        },
        format(type, timestamp = null, filesize = null) {
            switch (type) {
                case "date":
                    const date = new Date(timestamp);

                    // Format the date as yyyy/mm/dd hh:mm
                    return `${date.getFullYear()}/${(date.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${date
                        .getDate()
                        .toString()
                        .padStart(2, "0")} ${date
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`;
                case "filesize":
                    const units = ["Bytes", "KB", "MB", "GB"];
                    let size = Number(filesize);
                    let unitIndex = 0;

                    while (size >= 1024 && unitIndex < units.length - 1) {
                        size /= 1024;
                        unitIndex++;
                    }

                    return `${size.toFixed(2)} ${units[unitIndex]}`;
            }
        },

        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        updateSelectedNotification() {},
        onChange() {
            this.filelist = [...this.$refs.file.files];
        },
        remove(i) {
            this.filelist.splice(i, 1);
        },
        dragover(event) {
            event.preventDefault();
            // Add some visual fluff to show the user can drop its files
            if (!event.currentTarget.classList.contains("bg-green/30")) {
                event.currentTarget.classList.remove("bg-gray/10");
                event.currentTarget.classList.add("bg-green/30");
            }
        },
        dragleave(event) {
            // Clean up
            event.currentTarget.classList.add("bg-gray/20");
            event.currentTarget.classList.remove("bg-green/30");
        },
        drop(event) {
            event.preventDefault();
            this.$refs.file.files = event.dataTransfer.files;
            this.onChange(); // Trigger the onChange event manually

            // Clean up
            event.currentTarget.classList.add("bg-gray/20");
            event.currentTarget.classList.remove("bg-green/30");
        },
        upload() {
            console.log(this.$refs.file.files);
        },
    },
};
</script>

<style></style>
