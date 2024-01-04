<template>
    <Transition>
        <div class="absolute w-full h-full">
            <div
                class="absolute w-full h-full bg-gray/90 z-50"
                @click="close"
            ></div>

            <div
                class="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
            >
                <div class="bg-white w-[400px]">
                    <div
                        v-if="is_editing"
                        class="p-4 px-6 flex flex-wrap text-[14px] max-h-[800px] overflow-y-auto"
                    >
                        <div
                            class="w-full text-center text-[18px] font-bold border-b border-gray/30 pb-1 mb-4"
                        >
                            {{ $t("edit_profile") }}
                        </div>

                        <!-- Drag and drop for profile picture -->
                        <div class="w-full font-semibold">
                            {{ $t("profile_picture") }}
                        </div>
                        <div class="w-full mb-4">
                            <div
                                class="p-3 bg-gray/10 border border-gray/20 shadow shadow-gray/30"
                                @dragover="dragover"
                                @dragleave="dragleave"
                                @drop="drop"
                            >
                                <input
                                    type="file"
                                    name="fields[assetsFieldHandle][]"
                                    id="assetsFieldHandle"
                                    class="w-px h-px opacity-0 overflow-hidden absolute"
                                    @change="onChange"
                                    ref="file"
                                    accept=".jpg,.jpeg,.png"
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
                                        {{
                                            $t(
                                                "drop_your_profile_picture_in_here"
                                            )
                                        }}
                                        <p>{{ $t("or") }}</p>
                                        <span
                                            class="underline cursor-pointer"
                                            >{{ $t("click_here") }}</span
                                        >
                                    </div>
                                </label>
                                <div
                                    v-if="this.filelist.length"
                                    class="flex flex-wrap justify-center items-center"
                                >
                                    <img
                                        v-if="image_url"
                                        :src="image_url"
                                        class="w-full h-full aspect-auto mb-1"
                                    />

                                    <div
                                        class="cursor-pointer hover:bg-gray/80 bg-gray transition text-white text-[11px] p-1.5 py-1 border-b border-gray/30 w-full flex justify-between items-center"
                                        v-for="file in filelist"
                                        :key="file.id"
                                    >
                                        <!-- Icon -->
                                        <div>
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
                                                    isFileType(file.type, 'jpg')
                                                "
                                                class="w-7 h-6"
                                            />
                                        </div>

                                        <!-- Name -->
                                        <div
                                            class="flex justify-center items-center truncate w-full"
                                        >
                                            {{ file.name }}
                                        </div>

                                        <!-- Remove Button -->
                                        <button
                                            type="button"
                                            @click="
                                                remove(filelist.indexOf(file))
                                            "
                                            title="Remove file"
                                            class="hover:bg-darkred bg-red p-2 py-1 transition w-fit h-full"
                                        >
                                            &#x0058;
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p
                                class="italic text-[10px] w-full text-right text-red"
                            >
                                {{ $t("recommended_size_:_750px_X_790px") }}
                            </p>
                        </div>

                        <!-- Address Emergency Contact no & name -->
                        <div class="flex flex-wrap gap-2 mb-4">
                            <div
                                v-for="key in filteredEditKeys"
                                :key="key"
                                class="w-full"
                            >
                                <div class="font-semibold">{{ $t(key) }}</div>
                                <input
                                    type="text"
                                    v-model="edited[key]"
                                    class="text-gray focus:outline-none p-2 text-center w-full bg-gray/10 shadow shadow-gray/50"
                                />
                            </div>
                        </div>

                        <!-- Save or cancel buttons -->
                        <div class="w-full flex justify-end items-center gap-2">
                            <div
                                @click="cancel"
                                class="transition hover:text-red hover:underline cursor-pointer"
                            >
                                {{ $t("cancel") }}
                            </div>
                            <div
                                class="cursor-pointer hover:bg-darkred transition p-1 px-3 bg-red text-white shadow shadow-gray"
                                @click="update"
                            >
                                {{ $t("update") }}
                            </div>
                        </div>
                    </div>

                    <div v-else>
                        <!-- Profile Picture and Name -->
                        <div class="relative">
                            <img
                                :src="profile_picture_url"
                                class="w-[400px] h-[400px]"
                            />
                            <div
                                class="absolute bottom-4 left-8 text-[20px] text-white text-center"
                            >
                                {{ profile.name }}
                            </div>
                            <div
                                class="p-2 cursor-pointer transition hover:bg-darkred bg-red w-fit rounded-full absolute right-4 -bottom-5"
                                @click="this.is_editing = !this.is_editing"
                            >
                                <img src="../assets/edit.svg" class="w-6 h-6" />
                            </div>
                        </div>
                        <div
                            class="grid grid-cols-2 gap-4 w-full bg-white p-8 max-h-[400px] overflow-y-auto"
                        >
                            <div
                                v-for="displayKey in filteredKeys"
                                :key="displayKey"
                                class="text-[12px] flex flex-wrap"
                            >
                                <div class="w-full font-bold">
                                    {{ $t(displayKey) }}
                                </div>
                                <div
                                    v-if="displayKey === 'born_date'"
                                    class="text-gray/80"
                                >
                                    {{ formatDateTime(profile[displayKey]) }}
                                </div>
                                <div
                                    v-else-if="displayKey === 'sex'"
                                    class="text-gray/80"
                                >
                                    {{ $t(`${profile[displayKey]}`) }}
                                </div>
                                <div v-else class="text-gray/80">
                                    {{ profile[displayKey] }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    emits: ["close", "updated"],
    props: {
        profile: {
            type: Object,
            default: null,
        },
    },
    watch: {
        profile: {
            handler(newProfile, oldProfile) {
                this.edited.address = newProfile.address;
                this.edited.emergency_contact_no =
                    newProfile.emergency_contact_no;
                this.edited.emergency_contact_name =
                    newProfile.emergency_contact_name;
                this.original_edited = JSON.parse(JSON.stringify(this.edited));
                this.profile_picture_url = `data:${newProfile.picture.mimetype};base64,${newProfile.picture.buffer}`;
            },
            deep: true, // Watch nested properties
        },
    },
    computed: {
        filteredKeys() {
            return Object.keys(this.profile).filter(
                (key) => !["language", "last", "picture"].includes(key)
            );
        },
        filteredEditKeys() {
            return Object.keys(this.edited);
        },
    },
    data() {
        return {
            filelist: [],
            is_editing: false,
            edited: {
                address: null,
                emergency_contact_no: null,
                emergency_contact_name: null,
            },
            original_edited: {},
            image_url: null,
            profile_picture_url: null,
            api_url: "http://127.0.0.1:3000",
        };
    },
    async mounted() {
        console.log("PROFILE MOUNTED");
    },
    methods: {
        close() {
            this.$emit("close");
            if (this.is_editing)
                this.edited = JSON.parse(JSON.stringify(this.original_edited));

            this.is_editing = false;
        },
        formatDateTime(isoString) {
            const date = new Date(isoString);

            // Get individual date and time components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            // Create the formatted string
            const formattedDateTime = `${year}/${month}/${day}`;

            return formattedDateTime;
        },
        cancel() {
            this.is_editing = !this.is_editing;
        },
        async update() {
            // Basic validation: Check if 'edited' is an object
            if (!this.edited || typeof this.edited !== "object") {
                console.error(
                    "Invalid input. Expected an object for validation."
                );
                return;
            }

            const malaysiaTelRegex =
                /^(01[0-46-9]|011[0-9])[0-9]{7,8}$|^(01[2-5]|01[6-9]|03|04|05|06|07|08|09)[0-9]{8}$/;

            // Phone validation
            if (
                this.edited.hasOwnProperty("emergency_contact_no") &&
                typeof this.edited.emergency_contact_no === "string" &&
                !malaysiaTelRegex.test(this.edited.emergency_contact_no)
            ) {
                this.$swal({
                    title: "Update Profile",
                    text: "Invalid Contact No. Format.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }

            //  Address and name validation
            if (
                (this.edited.hasOwnProperty("address") &&
                    (this.edited.address === null ||
                        typeof this.edited.address !== "string" ||
                        this.edited.address.trim() === "")) ||
                (this.edited.hasOwnProperty("emergency_contact_name") &&
                    (this.edited.emergency_contact_name === null ||
                        typeof this.edited.emergency_contact_name !==
                            "string" ||
                        this.edited.emergency_contact_name.trim() === ""))
            ) {
                this.$swal({
                    title: "Update Profile",
                    text: "Invalid value for address or emergency contactname. Please provide valid non-empty strings.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }

            //  Check if update is necessary
            if (
                (await !this.areObjectsEqual(
                    this.original_edited,
                    this.edited
                )) ||
                this.filelist.length
            )
                await this.performUpdate();
            else {
                // No update Noti
                this.$swal({
                    title: "Update Profile",
                    text: "No modification and update.",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 2000,
                });
                this.is_editing = !this.is_editing;
            }

            this.reset();
        },
        async performUpdate() {
            const passcode = await sessionStorage.getItem("passcode");
            const formData = new FormData();

            // Append the file only if it exists
            if (this.filelist.length > 0)
                formData.append("file", this.filelist[0]);

            // Append the edited data if not the same as fetched data
            if (!this.areObjectsEqual(this.edited, this.original_edited))
                formData.append("edited", JSON.stringify(this.edited));

            try {
                const response = await this.axios.put(
                    this.api_url + "/profile/upload",
                    formData,
                    {
                        headers: {
                            Authorization: passcode,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data.message === "Profile Updated") {
                    this.is_editing = false;
                    this.$swal({
                        title: "Update Profile",
                        text: "Updated Succesfully",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                this.$emit("updated");
            } catch (error) {
                // Handle error
                console.error(error);
            }
        },
        areObjectsEqual(obj1, obj2) {
            // Get the keys of each object
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);

            // Check if the number of keys is the same
            if (keys1.length !== keys2.length) {
                return false;
            }

            // Iterate over keys and compare values
            for (const key of keys1) {
                // Check if the key exists in both objects
                if (!keys2.includes(key)) {
                    return false;
                }

                // Check if the values are equal
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }

            // Objects are considered equal
            return true;
        },
        async onChange() {
            this.filelist = await [...this.$refs.file.files];
        },
        async createObjectURL(file) {
            return file ? URL.createObjectURL(file) : "";
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

            // Check if filelist is empty before adding a new file
            if (this.filelist.length === 0) {
                const droppedFiles = event.dataTransfer.files;

                // Check if the dropped file is of the allowed types
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                const isFileTypeAllowed = Array.from(droppedFiles).every(
                    (file) => allowedTypes.includes(file.type)
                );

                if (isFileTypeAllowed) {
                    this.$refs.file.files = droppedFiles;
                    this.onChange(); // Trigger the onChange event manually

                    const file = droppedFiles[0];
                    this.image_url = await this.createObjectURL(file);

                    // Clean up
                    event.currentTarget.classList.add("bg-gray/20");
                    event.currentTarget.classList.remove("bg-green/30");
                } else {
                    // If file type is not allowed, show an error or give feedback to the user
                    this.$swal({
                        title: "File Upload",
                        text: "Please upload only JPG, PNG, or JPEG files.",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
            } else {
                // If filelist is not empty, show an error or give feedback to the user
                this.$swal({
                    title: "File Upload",
                    text: "You can upload only one file.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        },

        isFileType(fileType, expectedType) {
            const extension = fileType.split("/")[1];
            if (expectedType) return extension === expectedType;
            else {
                if (!extension || !["png", "jpeg", "jpg"].includes(extension))
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
        reset() {
            this.filelist = [];
            this.image_url = null;
        },
    },
};
</script>
