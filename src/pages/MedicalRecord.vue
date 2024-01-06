<template>
    <!-- TRANSLATION -->

    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <!-- Access denied -->
        <AccessDenied v-if="is_access_denied"></AccessDenied>

        <!-- <Loader
            :loading="is_loading"
            class="w-4/5 z-30 absolute"
            v-if="is_loading"
        ></Loader> -->

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
                            class="w-full max-w-[95%] pb-4 border-b border-gray/20"
                        >
                            <!-- Filter area -->
                            <!-- mpid/mp name (medical personnel) |  | date -->
                            <div
                                class="mt-2 grid grid-cols-5 gap-2 text-[12px] p-1"
                            >
                                <div class="col-span-2 w-full">
                                    {{ $t("medical_personnel_id_/_name") }}
                                </div>
                                <div class="col-span-2 w-full">
                                    {{ $t("date") }}
                                </div>
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
                                        style="border-radius: 0"
                                    />
                                </div>
                                <Button
                                    :title="$t('search')"
                                    customClass="text-center bg-gray/70 hover:bg-gray/90 text-white shadow"
                                    medium
                                ></Button>
                            </div>
                        </div>

                        <!-- Record View Panel  -->
                        <div
                            class="shadow shadow-gray font-sans w-[95%] mt-3 text-[12px] mb-3"
                        >
                            <div
                                class="w-full min-h-[600px] max-h-[1200px] grid grid-cols-5"
                            >
                                <!-- Directory Tree -->

                                <div
                                    class="col-span-1 pb-3 overflow-y-auto bg-gray/90"
                                >
                                    <!-- Tree title -->
                                    <div
                                        class="bg-gray text-white w-full flex justify-center p-2"
                                    >
                                        <p class="">
                                            {{ $t("record_type") }}
                                        </p>
                                    </div>

                                    <!-- Tree bar -->
                                    <div class="pt-2">
                                        <details
                                            v-for="(r, rKey) in records"
                                            :key="rKey"
                                            class="text-[12px] pb-0.5 text-white w-full"
                                        >
                                            <summary
                                                class="px-3 truncate hover:bg-white/20 cursor-pointer transition"
                                                :title="$t(getTypeName(rKey))"
                                            >
                                                &#128193;
                                                {{ $t(getTypeName(rKey)) }}
                                            </summary>
                                            <div
                                                class="flex pl-9 hover:bg-white/20 cursor-pointer transition"
                                                v-for="recordItem in r"
                                                :key="recordItem.index"
                                                @click="
                                                    selectRecord(recordItem)
                                                "
                                            >
                                                📄
                                                {{ recordItem.name }}
                                            </div>
                                        </details>
                                    </div>
                                </div>

                                <!-- View panel -->

                                <div
                                    class="w-full col-span-4 h-full bg-gray/10 text-white overflow-y-auto"
                                >
                                    <!-- View Panel Title -->
                                    <div
                                        class="justify-center p-1 px-3 font-bold text-md flex items-center w-full bg-[#fcd53f] text-gray"
                                    >
                                        <div class="px-1 mr-2 bg-white/70">
                                            {{ $t("record") }}
                                        </div>
                                    </div>

                                    <div class="p-0.5">
                                        <!-- Loader -->
                                        <div v-if="is_loading">
                                            <div class="w-full h-full p-4">
                                                <div
                                                    class="animate-pulse flex flex-wrap w-full"
                                                >
                                                    <div
                                                        class="h-[300px] rounded w-full bg-gray mb-4"
                                                    ></div>
                                                    <div
                                                        class="flex-1 space-y-6 py-1"
                                                    >
                                                        <div class="space-y-3">
                                                            <div
                                                                class="h-2 bg-gray rounded"
                                                            ></div>
                                                            <div
                                                                class="grid grid-cols-3 gap-4"
                                                            >
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-1"
                                                                ></div>
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-2"
                                                                ></div>
                                                            </div>
                                                            <div
                                                                class="h-2 bg-gray rounded"
                                                            ></div>
                                                            <div
                                                                class="grid grid-cols-3 gap-4"
                                                            >
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-1"
                                                                ></div>
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-2"
                                                                ></div>
                                                            </div>
                                                            <div
                                                                class="h-2 bg-gray rounded"
                                                            ></div>
                                                            <div
                                                                class="grid grid-cols-3 gap-4"
                                                            >
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-2"
                                                                ></div>
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-1"
                                                                ></div>
                                                            </div>
                                                            <div
                                                                class="h-2 bg-gray rounded"
                                                            ></div>
                                                            <div
                                                                class="grid grid-cols-3 gap-4"
                                                            >
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-1"
                                                                ></div>
                                                                <div
                                                                    class="h-2 bg-gray rounded col-span-2"
                                                                ></div>
                                                            </div>
                                                            <div
                                                                class="h-2 bg-gray rounded"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Loading animation -->
                                        <div
                                            v-if="is_document_retrieval_loading"
                                            class="w-full h-[400px] flex-col items-center flex flex-wrap justify-center"
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

                                        <!-- pdf viewer -->
                                        <embed
                                            v-if="is_pdf"
                                            :src="showing_file"
                                            width="100%"
                                            class="min-h-[600px] h-full"
                                        />

                                        <!-- img viewer -->
                                        <div v-if="is_img">
                                            <img :src="showing_file" />
                                        </div>
                                    </div>
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
            showing_file: null,
            is_img: false,
            is_pdf: false,

            // modalTitle: "Custom Modal",
            // show: false,
            is_loading: false,
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            selected_record_item: null,
            api_url: "http://127.0.0.1:3000",
            records: null,
            record_types: null,
            is_document_retrieval_loading: false,
        };
    },
    computed: {},
    async created() {
        console.log("CREATED");
        this.user = await JSON.parse(sessionStorage.getItem("user"));
        this.user.passcode = await sessionStorage.getItem("passcode");

        await this.fetch();
    },
    methods: {
        getTypeName(type_id) {
            return this.record_types.filter((r) => r.id == type_id)[0].name;
        },
        convertToFormattedRecords(records) {
            records = records.map((r) => {
                const rec = {
                    index: r.index,
                    type: r.data.type,
                    name: r.data.file.originalname,
                    mimetype: r.data.file.mimetype,
                };
                return rec;
            });

            const recordsBasedOnType = {};
            this.record_types.forEach((rt) => (recordsBasedOnType[rt.id] = []));
            records.forEach((r) =>
                recordsBasedOnType[r.type].push({
                    index: r.index,
                    name: r.name,
                    mimetype: r.mimetype,
                })
            );
            return recordsBasedOnType;
        },
        async fetch() {
            this.is_document_retrieval_loading = true;
            console.log("FETCH");
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

            const result = await this.axios.get(
                `${this.api_url}/medical-record/${this.user.id}`,
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                    data: {},
                }
            );

            this.records = await this.convertToFormattedRecords(
                result.data.message
            );
            this.is_document_retrieval_loading = false;
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        capitaliseSentence(sentence) {
            const newSentence = sentence
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return newSentence;
        },

        clearRecord() {
            this.selected_record_item = null;
        },
        async selectRecord(r) {
            this.is_img = false;
            this.is_pdf = false;
            this.selected_record_item = r;

            // Download data if no buffer data

            this.is_loading = true;
            const response = await this.axios.get(
                this.api_url + `/record/retrieve/${r.index}`,
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );
            const resultData = response.data.message;

            this.is_loading = false;
            this.is_img = r.mimetype.split("/")[0] === "image";
            this.is_pdf = r.mimetype.split("/")[1] === "pdf";

            this.showing_file = `data:${r.mimetype};base64,${resultData.buffer}`;

            console.log(this.showing_file);
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
