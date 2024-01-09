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

        <div v-if="is_view_incident_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
                @click="closeViewIncidentModal"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <div class="font-bold w-full text-center">
                    {{ $t("incident_info") }}
                </div>

                <div
                    class="grid grid-cols-2 gap-4 w-full p-8 max-h-[400px] overflow-y-auto"
                >
                    <div
                        v-for="displayKey in Object.keys(selected_incident)"
                        :key="displayKey"
                        class="text-[12px] flex flex-wrap"
                        :class="{
                            'col-span-2 row-span-2':
                                displayKey === 'description',
                        }"
                    >
                        <div class="w-full font-bold">
                            {{ $t(displayKey) }}
                        </div>
                        <div
                            v-if="displayKey.split('_')[1] === 'timestamp'"
                            class="text-gray/80"
                        >
                            {{
                                formatDateTime(
                                    selected_incident[displayKey],
                                    true
                                )
                            }}
                        </div>

                        <div
                            v-else-if="displayKey === 'type_id'"
                            class="text-gray/80"
                        >
                            {{
                                incident_type[selected_incident[displayKey] - 1]
                                    .name
                            }}
                        </div>

                        <div v-else class="text-gray/80">
                            {{ selected_incident[displayKey] }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="is_add_incident_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
                @click="closeAddIncidentModal"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <div class="font-bold w-full text-center">
                    {{ $t("add_incident") }}
                </div>

                <!-- Title -->

                <!-- Form body -->
                <div class="my-4 w-full">
                    <!-- Patient selection -->
                    <div class="w-full font-bold text-left">
                        {{ $t("incident_type") }}
                    </div>

                    <input
                        list="incident_type"
                        v-model="new_incident.type"
                        class="w-full text-center p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                    />
                    <datalist id="incident_type" name="incident_type">
                        <option
                            v-for="p in incident_type"
                            :key="p"
                            :value="'[' + p.id + '] ' + p.name"
                        ></option>
                    </datalist>

                    <!-- Note -->
                    <div class="w-full font-bold text-left mt-3">
                        {{ $t("description") }}
                    </div>
                    <textarea
                        class="focus:outline-none p-2 w-full bg-transparent border-b border-gray/50"
                        v-model="new_incident.description"
                    ></textarea>
                </div>

                <!-- Buttons -->
                <div class="w-full flex justify-end mt-2 items-center gap-2">
                    <button
                        class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                        @click="handleAddIncident"
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
                            <p>{{ $t("incident_report_channel") }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center w-full">
                        <div class="w-full lg:max-w-[950px]">
                            <!-- Title + Add incident Button -->
                            <div class="w-full flex gap-2 items-center">
                                <div class="grow"></div>

                                <div
                                    class="cursor-pointer bg-darkgreen hover:bg-cool transition text-white p-2 py-1 text-[14px] flex items-center"
                                    @click="exportFile"
                                >
                                    <img
                                        src="../assets/export.svg"
                                        class="w-4 h-4 mr-1"
                                    />
                                    {{ $t("export") }}
                                </div>
                                <div
                                    class="cursor-pointer bg-red hover:bg-darkred transition text-white p-2 py-1 text-[14px] flex items-center"
                                    v-if="selected_tab === 0"
                                    @click="openAddIncidentModal"
                                >
                                    <img
                                        src="../assets/add.svg"
                                        class="w-4 h-4 mr-1"
                                    />
                                    {{ $t("add_incident") }}
                                </div>
                            </div>

                            <!-- Search bar -->
                            <div
                                class="mt-1 flex items-center p-1 px-0"
                                v-if="selected_tab === 0"
                            >
                                <input
                                    type="text"
                                    class="w-full focus:outline-none p-1 px-2 text-xs bg-gray text-white"
                                />
                                <img
                                    src="../assets/search.svg"
                                    class="cursor-pointer w-6 h-6 p-1 bg-gray/80 backdrop-blur transition hover:bg-gray/90"
                                />
                            </div>

                            <!-- Tabs -->
                            <div
                                class="w-full text-[14px] flex gap-1 mt-3 border-b border-gray/30"
                            >
                                <div
                                    @click="selectTab(0)"
                                    :class="{
                                        'border-b-4 border-red ':
                                            selected_tab === 0,
                                        'border-none': selected_tab !== 0,
                                    }"
                                    class="h-full transition cursor-pointer hover:bg-gray/10 p-2 w-fit"
                                >
                                    {{ $t("my_incident") }}
                                </div>
                                <div
                                    @click="selectTab(1)"
                                    :class="{
                                        'border-b-4 border-red':
                                            selected_tab === 1,
                                        'border-none': selected_tab !== 1,
                                    }"
                                    class="transition cursor-pointer hover:bg-gray/10 p-2 w-fit h-full"
                                >
                                    {{ $t("incident_management") }}
                                </div>
                            </div>

                            <!-- TAB 0: Incidents -->
                            <div
                                class="mt-4 text-[14px]"
                                v-if="selected_tab === 0"
                            >
                                <!-- Headers -->
                                <div class="grid grid-cols-5">
                                    <div class="col-span-2 grid grid-cols-3">
                                        <!-- id -->
                                        <div
                                            class="bg-gray py-1 text-white text-center"
                                        >
                                            <div
                                                class="border-r border-white/30 h-full flex justify-center items-center"
                                            >
                                                {{ $t("id") }}
                                            </div>
                                        </div>
                                        <!-- type -->
                                        <div
                                            class="bg-gray py-1 text-white text-center col-span-2"
                                        >
                                            <div
                                                class="border-r border-white/30 h-full flex justify-center items-center"
                                            >
                                                {{ $t("type") }}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="border-r border-white/30 h-full flex justify-center items-center"
                                        >
                                            {{ $t("description") }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="border-r border-white/30 h-full flex justify-center items-center"
                                        >
                                            {{ $t("timestamp") }}
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="h-full flex justify-center items-center"
                                        >
                                            {{ $t("status") }}
                                        </div>
                                    </div>
                                </div>

                                <!--  Body -->
                                <div
                                    class="hover:bg-gray/10 cursor-pointer transition grid grid-cols-5 slide-in-left-to-right py-2 border-b border-x border-gray/30"
                                    v-for="(i, index) in incident"
                                    :key="index"
                                    :style="{
                                        'animation-delay': `${
                                            0.1 + index * 0.2
                                        }s`,
                                    }"
                                    @click="openViewIncidentModal(i)"
                                >
                                    <div class="col-span-2 grid grid-cols-3">
                                        <div
                                            class="flex items-center justify-center"
                                        >
                                            {{ i.id }}
                                        </div>
                                        <div
                                            class="text-left my-auto px-1 truncate col-span-2"
                                        >
                                            {{
                                                incident_type[i.type_id - 1]
                                                    .name
                                            }}
                                        </div>
                                    </div>
                                    <div
                                        class="text-left my-auto px-1 truncate"
                                    >
                                        {{ i.description }}
                                    </div>
                                    <div
                                        class="flex items-center justify-center"
                                    >
                                        {{
                                            formatDateTime(
                                                i.created_timestamp,
                                                true
                                            )
                                        }}
                                    </div>
                                    <div
                                        class="flex items-center justify-center"
                                        :class="{
                                            'text-red': i.status === 'pending',
                                            'text-blue':
                                                i.status === 'processing',
                                            'text-darkgreen':
                                                i.status === 'solved',
                                        }"
                                    >
                                        {{ $t(i.status) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Tab 1: management -->
                            <div
                                class="mt-4 text-[14px]"
                                v-if="selected_tab === 1"
                            >
                                <div
                                    class="w-full flex justify-end items-center mb-2"
                                >
                                    <div
                                        class="bg-gray text-white px-2 py-1 mr-2"
                                    >
                                        {{ $t("status_filter") }}
                                    </div>
                                    <input
                                        list="filter_status"
                                        v-model="filter_status"
                                        class="w-fit text-center p-1 bg-transparent focus:outline-none border border-gray/50 cursor-pointer"
                                    />
                                    <datalist
                                        id="filter_status"
                                        name="filter_status"
                                    >
                                        <option
                                            v-for="p in predefined_status"
                                            :key="p"
                                            :value="p"
                                        >
                                            {{ $t(p) }}
                                        </option>
                                    </datalist>
                                </div>

                                <!-- Headers -->
                                <div class="grid grid-cols-3">
                                    <div class="col-span-2 grid grid-cols-3">
                                        <!-- id -->
                                        <div
                                            class="bg-gray py-1 text-white text-center"
                                        >
                                            <div
                                                class="border-r border-white/30 h-full flex justify-center items-center"
                                            >
                                                {{ $t("id") }}
                                            </div>
                                        </div>
                                        <!-- type -->
                                        <div
                                            class="bg-gray py-1 text-white text-center col-span-2"
                                        >
                                            <div
                                                class="border-r border-white/30 h-full flex justify-center items-center"
                                            >
                                                {{ $t("type") }}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="bg-gray py-1 text-white text-center"
                                    >
                                        <div
                                            class="h-full flex justify-center items-center"
                                        >
                                            {{ $t("action") }}
                                        </div>
                                    </div>
                                </div>

                                <!--  Body -->
                                <div
                                    class="hover:bg-gray/10 cursor-pointer transition grid grid-cols-3 slide-in-left-to-right py-2 border-b border-x border-gray/30"
                                    v-for="(i, index) in filtered_incident"
                                    :key="index"
                                    :style="{
                                        'animation-delay': `${
                                            0.1 + index * 0.2
                                        }s`,
                                    }"
                                >
                                    <div class="col-span-2 grid grid-cols-3">
                                        <div
                                            class="flex items-center justify-center"
                                        >
                                            {{ i.id }}
                                        </div>
                                        <div
                                            class="text-left my-auto px-1 truncate col-span-2"
                                        >
                                            {{
                                                incident_type[i.type_id - 1]
                                                    .name
                                            }}
                                        </div>
                                    </div>

                                    <div
                                        class="flex items-center justify-center gap-2"
                                    >
                                        <div
                                            class="p-1 px-2 bg-gray/80 text-white transition cursor-pointer hover:bg-gray"
                                            @click="openViewIncidentModal(i)"
                                        >
                                            {{ $t("view") }}
                                        </div>
                                        <div
                                            v-if="i.status === 'pending'"
                                            class="p-1 px-2 bg-red text-white transition cursor-pointer hover:bg-darkred"
                                            @click="process(i)"
                                        >
                                            {{ $t("process") }}
                                        </div>

                                        <div
                                            v-if="i.status === 'processing'"
                                            class="p-1 px-2 bg-darkgreen text-white transition cursor-pointer hover:bg-cool"
                                            @click="solve(i)"
                                        >
                                            {{ $t("solve") }}
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
import { utils as XLSXUtils, write as XLSXWrite } from "xlsx";
import { saveAs } from "file-saver";

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
            is_view_incident_modal_shown: false,
            is_add_incident_modal_shown: false,
            selected_events: [],
            api_url: "http://127.0.0.1:3000",

            incident_type: [],
            incident: [],
            selected_tab: 0,
            selected_incident: null,
            new_incident: {
                type: null,
                description: null,
            },
            filter_status: null,
            predefined_status: ["pending", "processing", "solved"],
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
    computed: {
        filtered_incident() {
            if (!this.filter_status) return this.incident;
            else {
                return this.incident.filter(
                    (i) => i.status === this.filter_status
                );
            }
        },
    },

    methods: {
        async closeAddIncidentModal() {
            this.is_add_incident_modal_shown = false;
            await this.resetAddIncident();
        },
        openAddIncidentModal() {
            this.is_add_incident_modal_shown = true;
        },
        async handleAddIncident() {
            if (!(this.new_incident.type && this.new_incident.description)) {
                this.$swal({
                    title: "New Incident Report",
                    text: "Please fill in all the field",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            } else {
                // Submit
                const [, id, name] =
                    this.new_incident.type.match(/\[(\d*)\]\s*(.*)/);

                const response = await this.axios.post(
                    this.api_url + "/incident/add",
                    {
                        type_id: id,
                        description: this.new_incident.description,
                    },
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                if (response.data.message) {
                    this.$swal({
                        title: "New Incident Report",
                        text: "Added Successfully.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    await this.fetch();
                } else {
                    this.$swal({
                        title: "New Incident Report",
                        text: "Added Failed",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                }
                await this.closeAddIncidentModal();
            }
        },
        resetAddIncident() {
            this.new_incident.type = null;
            this.new_incident.description = null;
        },
        async process(incident) {
            const response = await this.axios.post(
                this.api_url + `/incident/update/${incident.id}/processing`,
                {},
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );
            if (response.data.message) {
                this.$swal({
                    title: "Update Incident",
                    text: "Successfully change incident status to processing.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
                await this.fetch();
            }
        },
        async solve(incident) {
            const response = await this.axios.post(
                this.api_url + `/incident/update/${incident.id}/solved`,
                {},
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );
            if (response.data.message) {
                this.$swal({
                    title: "Update Incident",
                    text: "Successfully change incident status to solved.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
                await this.fetch();
            }
        },

        openViewIncidentModal(incident) {
            this.selected_incident = incident;
            this.is_view_incident_modal_shown = true;
        },
        closeViewIncidentModal() {
            this.is_view_incident_modal_shown = false;
            this.selected_incident = null;
        },

        async fetch() {
            try {
                // incident type
                const response_type = await this.axios.get(
                    this.api_url + `/incident/type`,
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );
                this.incident_type = response_type.data.message;
                // incident
                const response = await this.axios.get(
                    this.api_url + `/incident/data`,
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );
                this.incident = response.data.message;
            } catch (e) {
                console.error(e.message);
            }
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        formatDateTime(isoString, needTime = false) {
            const date = new Date(isoString);

            // Get individual date and time components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            // Create the formatted date string
            let formattedDateTime = `${year}/${month}/${day}`;

            // Include time component if needTime is true
            if (needTime) {
                const hours = String(date.getHours()).padStart(2, "0");
                formattedDateTime += ` [${hours}:00]`;
            }

            return formattedDateTime;
        },
        selectTab(index) {
            this.selected_tab = index;
        },
        exportFile() {
            // Create a worksheet
            const ws = XLSXUtils.json_to_sheet(this.incident);

            // Create a workbook
            const wb = XLSXUtils.book_new();
            XLSXUtils.book_append_sheet(wb, ws, "Sheet1");

            // Convert the workbook to a blob
            const blob = XLSXWrite(wb, { bookType: "xlsx", type: "array" }); // Use "array" type
            saveAs(
                new Blob([blob], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }),
                "incidents.xlsx"
            );
        },
    },
};
</script>

<style></style>
