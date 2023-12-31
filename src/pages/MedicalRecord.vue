<template>
    <!-- TRANSLATION -->

    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <!-- Access denied -->
        <AccessDenied v-if="is_access_denied"></AccessDenied>

        <Loader
            :loading="is_loading"
            class="w-4/5 z-30 absolute"
            v-if="is_loading"
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
                            class="shadow shadow-gray font-sans w-full max-w-[1140px] mt-3 text-[12px] mb-3"
                        >
                            <div
                                class="w-full min-h-[600px] max-h-[1200px] grid grid-cols-5"
                            >
                                <!-- Directory Tree -->

                                <div
                                    class="col-span-2 pb-3 overflow-y-auto bg-gray/90"
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
                                    <div class="">
                                        <details
                                            v-for="(
                                                record, recordKey
                                            ) in records"
                                            :key="recordKey"
                                            class="text-[12px] pb-0.5 text-white w-full"
                                        >
                                            <summary
                                                class="px-3 truncate hover:bg-white/20 cursor-pointer transition"
                                                :title="$t(recordKey)"
                                            >
                                                &#128193;
                                                {{ $t(recordKey) }}
                                            </summary>
                                            <div
                                                class="flex pl-9 hover:bg-white/20 cursor-pointer transition"
                                                v-for="recordItem in record"
                                                :key="recordItem.id"
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
                                    class="col-span-3 bg-gray/10 text-white overflow-y-auto"
                                >
                                    <!-- View Panel Title -->
                                    <div
                                        class="justify-center p-1 px-3 font-bold text-md flex items-center w-full bg-[#fcd53f] text-gray"
                                    >
                                        <div class="px-1 mr-2 bg-white/70">
                                            {{ $t("record") }}
                                        </div>
                                    </div>

                                    <!-- View panel data -->
                                    <DocumentViewer></DocumentViewer>
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
            is_loading: false,
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_access_denied: false,
            is_sidebar_expanding: false,
            selected_record_item: null,
            api_url: "http://127.0.0.1:3000",
            records: null,
        };
    },
    async created() {
        console.log("CREATED");
        this.user = await JSON.parse(sessionStorage.getItem("user"));
        this.user.passcode = await sessionStorage.getItem("passcode");

        await this.fetch();
    },
    methods: {
        convertToFormatedRecord(records) {
            const resultObject = {};

            records.forEach(({ _id, type, name }) => {
                const typeKey = type;
                const recordInfo = { _id, name };

                if (!resultObject[typeKey]) {
                    resultObject[typeKey] = [recordInfo];
                } else {
                    resultObject[typeKey].push(recordInfo);
                }
            });

            return resultObject;
        },
        async fetch() {
            console.log("FETCH");
            const result = await this.axios.get(
                `${this.api_url}/medical-record/${this.user.id}`,
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                    data: {},
                }
            );
            console.log(result);

            this.records = this.convertToFormatedRecord(result.data.message);
            console.log(this.records);
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },

        clearRecord() {
            this.selected_record_item = null;
        },
        async selectRecord(r) {
            this.selected_record_item = r;
            console.log(r);

            // Download data if no buffer data
            if (!r.buffer) {
                this.is_loading = true;
                const result = await this.axios.get(
                    `${this.api_url}/medical-record/id/${r._id}`,
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );
                const newData = { buffer: result.data.message };

                // Dynamically search and replace based on type and _id
                await this.searchAndReplaceByObjectID(r._id, newData);
                console.log(this.records);

                this.is_loading = false;
            }
        },
        searchAndReplaceByObjectID(_id, newData) {
            // Iterate over the properties of this.records
            for (const type in this.records) {
                if (this.records[type] instanceof Array) {
                    // Find the index of the object with the matching _id
                    const index = this.records[type].findIndex(
                        (item) => item._id === _id
                    );

                    if (index !== -1) {
                        // Update the object with the new data
                        this.records[type][index] = {
                            ...this.records[type][index],
                            ...newData,
                        };
                        // Break out of the loop once the update is done
                        break;
                    }
                }
            }
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
