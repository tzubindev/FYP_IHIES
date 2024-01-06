<template>
    <!-- TRANSLATION -->
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <AccessDenied v-if="is_access_denied"></AccessDenied>

        <Loader
            :loading="is_loading"
            class="w-4/5 z-30 absolute"
            v-if="is_loading"
        ></Loader>

        <div v-if="is_add_record_type_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="max-h-[600px] overflow-y-auto bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <!-- Title -->
                <div class="font-bold w-full text-center">
                    {{ $t("add_record_type") }}
                </div>

                <!-- Form body -->
                <div class="my-4 w-full">
                    <!-- Current condition -->
                    <div class="w-full font-bold text-left mt-3">
                        {{ $t("record_name") }}
                    </div>
                    <input
                        class="focus:outline-none p-2 text-center w-full bg-transparent border-b border-gray/50"
                        type="text"
                        v-model="added_record_type"
                        maxlength="255"
                        minlength="3"
                    />
                </div>

                <!-- Buttons -->
                <div class="w-full flex justify-end mt-2 items-center gap-2">
                    <div
                        class="p-2 py-1 cursor-pointer transition hover:text-red hover:underline"
                        @click="closeAddRecordTypeModal"
                    >
                        {{ $t("cancel") }}
                    </div>
                    <button
                        class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                        @click.prevent="handleAddRecordType"
                        type="button"
                    >
                        {{ $t("confirm") }}
                    </button>
                </div>
            </div>
        </div>

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
                            <div class="grid grid-cols-2 gap-2 w-full">
                                <!-- Select Patient -->
                                <div
                                    class="resize-y overflow-y-auto min-h-[150px] max-h-[400px] h-24 bg-gray/10 w-full shadow shadow-gray/50"
                                >
                                    <!-- Search bar -->
                                    <div
                                        class="w-full p-2 flex justify-between gap-2 items-center h-[50px]"
                                    >
                                        <div class="text-[16px] pl-2">
                                            {{ $t("patient") }}
                                        </div>
                                        <input
                                            type="text"
                                            class="placeholder:text-gray/80 bg-white/80 h-full items-center flex px-3 p-0.5 text-[14px] focus:outline-none text-gray shadow shadow-gray/50"
                                            placeholder="Patient ID"
                                        />
                                    </div>

                                    <!-- patient row -->
                                    <div
                                        class="w-full grid grid-cols-1 gap-2 p-2"
                                    >
                                        <div
                                            class="hover:bg-gray/30 cursor-pointer transition bg-gray/10 shadow shadow-gray/50 w-full h-full p-1 text-[14px] text-center"
                                            v-for="p in patients"
                                            :key="p.id"
                                            @click="selectPatient(p.id)"
                                            :class="{
                                                'bg-red hover:bg-darkred':
                                                    selected_patient_id ===
                                                    p.id,
                                            }"
                                        >
                                            {{ p.id }} || {{ p.name }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Select record type -->
                                <div
                                    class="flex flex-wrap gap-1 bg-gray/10 shadow shadow-gray/50 pb-2"
                                >
                                    <!-- Title -->
                                    <div
                                        class="w-full flex justify-between items-center p-4 py-2.5"
                                    >
                                        <div class="text-[16px] w-fit">
                                            {{ $t("document_type") }}
                                        </div>
                                        <div
                                            class="p-1 bg-red w-fit rounded-full cursor-pointer transition hover:bg-darkred"
                                            @click="openAddRecordTypeModal"
                                        >
                                            <img
                                                src="../assets/add.svg"
                                                class="w-4 h-4"
                                            />
                                        </div>
                                    </div>

                                    <div class="w-full p-2 px-4">
                                        <input
                                            list="record_type"
                                            v-model="selected_record_type"
                                            class="w-full text-center text-[14px] p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                                        />
                                        <datalist
                                            id="record_type"
                                            name="record_type"
                                        >
                                            <option
                                                v-for="r in record_types"
                                                :key="r"
                                                :value="r.name"
                                            >
                                                {{ r.name }}
                                            </option>
                                        </datalist>
                                    </div>
                                </div>
                            </div>

                            <!-- Add record title-->
                            <div class="text-[16px] w-full mt-3">
                                {{ $t("add_record") }}
                            </div>

                            <!-- Drag and drop -->
                            <div class="w-full">
                                <div
                                    class="p-3 bg-gray/10 border border-gray/20 shadow shadow-gray/50"
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

                            <!-- Choose Exact Document  -->

                            <div
                                class="p-2 shadow shadow-gray/50 text-[12px] flex flex-wrap bg-gray/10 w-full h-fit"
                            >
                                <!-- Title -->
                                <div class="text-[16px] h-fit mb-3 pl-2">
                                    {{ $t("document_list") }}
                                </div>
                                <div
                                    v-for="r in filtered_records"
                                    :key="r.id"
                                    class="mb-1 grid grid-cols-8 bg-cool/20 shadow shadow-gray w-full p-2 py-1 cursor-pointer transition hover:bg-gray/30"
                                    @click="retriveDocument(r.index)"
                                >
                                    <div>{{ r.index }}</div>
                                    <div class="col-span-4">
                                        {{ r.data.file.originalname }}
                                    </div>
                                    <div>
                                        {{
                                            format(
                                                "filesize",
                                                null,
                                                r.data.file.size
                                            )
                                        }}
                                    </div>
                                    <div class="col-span-2">
                                        {{ format("date", r.timestamp) }}
                                    </div>
                                </div>

                                <!-- Loading animation -->
                                <div
                                    v-if="is_document_retrieval_loading"
                                    class="w-full flex flex-wrap justify-center"
                                >
                                    <img
                                        src="../assets/img_loading.gif"
                                        class="w-[64px] h-[64px]"
                                    />
                                    <div
                                        class="w-full text-center text-gray/80 animate-pulse"
                                    >
                                        {{ $t("fetching_documents") }}
                                    </div>
                                </div>
                            </div>

                            <!-- Document Viewer -->
                            <div class="text-[16px] w-full mt-4">
                                {{ $t("document_viewer") }}
                            </div>
                            <embed
                                v-if="is_pdf"
                                :src="showing_file"
                                width="100%"
                                class="min-h-[600px] h-full w-full"
                            />

                            <!-- img viewer -->
                            <div v-if="is_img">
                                <img :src="showing_file" />
                            </div>

                            <div
                                v-if="is_document_viewer_loading"
                                class="w-full flex flex-wrap justify-center"
                            >
                                <img
                                    src="../assets/img_loading.gif"
                                    class="w-[64px] h-[64px]"
                                />
                                <div
                                    class="w-full text-center text-gray/80 animate-pulse"
                                >
                                    {{ $t("fetching_document_data") }}
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
            is_pdf: false,
            is_img: false,
            is_verified: true,
            is_initiated: true,
            is_access_denied: false,
            is_sidebar_expanding: false,
            is_add_record_type_modal_shown: false,
            is_loading: false,
            is_document_retrieval_loading: false,
            is_document_viewer_loading: false,
            selected_events: [],
            api_url: "http://127.0.0.1:3000",
            added_record_type: null,
            selected_patient_id: null,
            filelist: [],
            patients: null,
            selected_record_type: null,
            selected_record_type_id: null,
            record_types: [],
            records: [],
        };
    },
    watch: {
        async selected_record_type(newVal, oldVal) {
            if (!newVal || newVal == "") {
                this.selected_record_type_id = null;
                return;
            } else {
                const result = this.record_types.filter(
                    (r) => this.capitaliseSentence(r.name) === newVal
                )[0];
                if (result && result.id)
                    this.selected_record_type_id = result.id;
                else this.selected_record_type_id = null;
            }
        },

        async selected_patient_id(newVal, oldVal) {
            if (newVal && newVal != oldVal) {
                await this.fetchDocuments();
            }
        },
    },
    computed: {
        filtered_records() {
            if (this.is_document_retrieval_loading) return [];
            else if (this.selected_record_type_id)
                return this.records.filter((r) => {
                    return r.data.type == this.selected_record_type_id;
                });
            else return this.records;
        },
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
        openAddRecordTypeModal() {
            this.is_add_record_type_modal_shown = true;
            this.added_record_type = null;
        },
        closeAddRecordTypeModal() {
            this.is_add_record_type_modal_shown = false;
        },
        async handleAddRecordType() {
            if (
                !this.added_record_type ||
                this.added_record_type.length < 3 ||
                this.added_record_type.length > 255
            ) {
                this.$swal({
                    title: "Add Record Type",
                    text: "Failed. The length of record type shall be in between 3 and 255. ",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }

            const response = await this.axios.post(
                this.api_url + "/medical-record-type/add",
                {
                    record_type: this.added_record_type,
                },
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            if (response.data.message) {
                this.$swal({
                    title: "Add Record Type",
                    text: "Succeess.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
                await this.fetch();
            } else {
                this.$swal({
                    title: "Add Record Type",
                    text: "Failed.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }

            this.closeAddRecordTypeModal();
        },
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

            const response_rt = await this.axios.get(
                this.api_url + "/medical-record-type",
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            this.record_types = response_rt.data.message;
            this.record_types = this.record_types.map(({ id, name }) => ({
                id,
                name: this.capitaliseSentence(name),
            }));
        },

        async fetchDocuments() {
            console.log("FETCH DOCUMENTS");
            this.is_document_retrieval_loading = true;

            const response = await this.axios.get(
                this.api_url + `/medical-record/${this.selected_patient_id}`,
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            if (response.data && response.data.message)
                this.records = Array.from(response.data.message);
            this.is_document_retrieval_loading = false;
        },
        async retriveDocument(index) {
            this.is_img = false;
            this.is_pdf = false;
            this.is_document_viewer_loading = true;

            const response = await this.axios.get(
                this.api_url + `/record/retrieve/${index}`,
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );
            this.is_document_viewer_loading = false;

            const mimetype = this.records.filter(
                (node) => node.index === index
            )[0].data.file.mimetype;

            this.is_img = mimetype.split("/")[0] === "image";
            this.is_pdf = mimetype.split("/")[1] === "pdf";

            this.showing_file = `data:${mimetype};base64,${response.data.message.buffer}`;
        },
        capitaliseSentence(sentence) {
            const newSentence = sentence
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return newSentence;
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
        async drop(event) {
            event.preventDefault();

            const droppedFiles = Array.from(event.dataTransfer.files);

            // Check if the dropped file is of the allowed types
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/jpg",
                "application/pdf",
            ];
            const isFileTypeAllowed = Array.from(droppedFiles).every((file) =>
                allowedTypes.includes(file.type)
            );

            if (isFileTypeAllowed) {
                // Append dropped files to existing files
                const existingFiles = Array.from(this.$refs.file.files);

                const allFiles = [...existingFiles, ...droppedFiles];

                // Create a Set to store unique files based on their names
                const uniqueFileSet = new Set();

                // Add files to the Set, using their names as unique identifiers
                allFiles.forEach((file) => {
                    uniqueFileSet.add(file.name);
                });

                // Create a new array from the Set
                const uniqueFilesArray = Array.from(uniqueFileSet).map(
                    (fileName) => {
                        // Find the corresponding file in the allFiles array
                        return allFiles.find((file) => file.name === fileName);
                    }
                );

                this.$refs.file.files = this.arrayToFileList(uniqueFilesArray);
                this.onChange();
            }
            // Clean up
            event.currentTarget.classList.add("bg-gray/20");
            event.currentTarget.classList.remove("bg-green/30");
        },
        async upload() {
            if (!this.selected_patient_id || !this.selected_record_type_id) {
                this.$swal({
                    title: "Upload New Record",
                    text: "Failed. Please select 1 patient and 1 document type.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }
            this.is_loading = true;
            const formData = new FormData();

            this.filelist.forEach((file, index) => {
                formData.append("files", file); // Use "files" as the field name
            });
            formData.append("id", this.selected_patient_id);
            formData.append("type", this.selected_record_type_id);

            try {
                const response = await this.axios.post(
                    this.api_url + "/medical-record/upload",
                    formData,
                    {
                        headers: {
                            Authorization: this.user.passcode,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.message) {
                    this.is_loading = false;
                    this.$swal({
                        title: "Medical Record",
                        text: "Added Succesfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    this.$refs.file.value = null;
                    this.filelist = [];
                    await this.fetch();
                    await this.fetchDocuments();
                } else {
                    this.$swal({
                        title: "Medical Record",
                        text: "Adding Record Failed.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            } catch (error) {
                // Handle error
                console.error(error);
            } finally {
                this.is_loading = false;
            }
        },
        arrayToFileList(fileArray) {
            const dataTransfer = new DataTransfer();

            for (let i = 0; i < fileArray.length; i++) {
                dataTransfer.items.add(fileArray[i]);
            }

            return dataTransfer.files;
        },
    },
};
</script>

<style></style>
