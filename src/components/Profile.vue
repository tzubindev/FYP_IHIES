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
                        class="p-4 px-6 flex flex-wrap text-[14px]"
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
                                                    isFileType(file.type, 'pdf')
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
                                                    isFileType(file.type, 'jpg')
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
                                                    isFileType(file.type, null)
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
                                                remove(filelist.indexOf(file))
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
                                src="../sample_assets/profilePic_tb.jpg"
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
    emits: ["close"],
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
            },
            deep: true, // Watch nested properties
        },
    },
    computed: {
        filteredKeys() {
            return Object.keys(this.profile).filter(
                (key) => !["language", "last"].includes(key)
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
        };
    },
    async mounted() {
        console.log("PROFILE MOUNTED");
    },
    methods: {
        close() {
            this.is_editing = false;
            this.$emit("close");
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
                    title: "Invalid Contact No.",
                    text: "Incorrect Format.",
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
                    title: "Invalid Format",
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
        },
        async performUpdate() {
            console.log("UPDATING");
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
    },
};
</script>
