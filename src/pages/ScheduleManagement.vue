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

        <!-- Schedule Info Modal -->
        <div v-if="is_schedule_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
                @click="closeScheduleInfo"
            ></div>
            <div
                class="text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 w-full max-w-[400px]"
            >
                <div
                    class="grid grid-cols-2 gap-4 w-full bg-white/90 p-8 max-h-[400px] overflow-y-auto"
                >
                    <div
                        v-for="displayKey in Object.keys(selected_schedule)"
                        :key="displayKey"
                        class="text-[12px] flex flex-wrap"
                    >
                        <div class="w-full font-bold">
                            {{ $t(displayKey) }}
                        </div>
                        <div
                            v-if="displayKey === 'timestamp'"
                            class="text-gray/80"
                        >
                            {{
                                formatDateTime(
                                    selected_schedule[displayKey],
                                    true
                                )
                            }}
                        </div>

                        <div v-else class="text-gray/80">
                            {{
                                selected_schedule[displayKey] === 1 ||
                                selected_schedule[displayKey] === 0
                                    ? Boolean(selected_schedule[displayKey])
                                    : selected_schedule[displayKey]
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pending Info Modal -->
        <div v-if="is_pending_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
                @click="closePendingModal"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <div class="font-bold w-full text-center">
                    {{ $t("pending_info") }}
                </div>

                <div
                    class="grid grid-cols-2 gap-4 w-full p-8 max-h-[400px] overflow-y-auto"
                >
                    <div
                        v-for="displayKey in Object.keys(selected_schedule)"
                        :key="displayKey"
                        class="text-[12px] flex flex-wrap"
                        :class="{
                            'col-span-2 row-span-2': displayKey === 'symptoms',
                        }"
                    >
                        <div class="w-full font-bold">
                            {{ $t(displayKey) }}
                        </div>
                        <div
                            v-if="displayKey === 'timestamp'"
                            class="text-gray/80"
                        >
                            {{
                                formatDateTime(
                                    selected_schedule[displayKey],
                                    true
                                )
                            }}
                        </div>
                        <div
                            v-else-if="displayKey === 'symptoms'"
                            class="text-gray/80"
                        >
                            {{ getSymptoms(selected_schedule[displayKey]) }}
                        </div>

                        <div v-else class="text-gray/80">
                            {{
                                selected_schedule[displayKey] === 1 ||
                                selected_schedule[displayKey] === 0
                                    ? Boolean(selected_schedule[displayKey])
                                    : selected_schedule[displayKey]
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Denied Reason Modal -->
        <div v-if="is_denied_schedule_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <div class="font-bold w-full text-center">
                    {{ $t("schedule_denied") }}
                </div>

                <div class="mt-4 text-left w-full">{{ $t("reason") }}:</div>
                <input
                    class="focus:outline-none p-2 text-center w-full bg-transparent border-b border-gray/50"
                    type="text"
                    v-model="denied_reason"
                    required
                />

                <div class="w-full flex justify-end mt-2">
                    <div
                        class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                        @click="notifyUser('SCHEDULE DENIED', denied_reason)"
                    >
                        {{ $t("confirm") }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Approved SCH Modal -->
        <div v-if="is_approved_schedule_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <div class="font-bold w-full text-center">
                    {{ $t("schedule_approved") }}
                </div>

                <div class="mt-4 text-left w-full">
                    {{ $t("assigned_to(department)") }}:
                </div>

                <!-- Department Dropdown box -->
                <select
                    required
                    name="departments"
                    id="departments"
                    v-model="assigned_department"
                    class="w-full bg-transparent text-center border-b border-gray/50 p-2 cursor-pointer focus:outline-none"
                >
                    <option
                        v-for="d in predefined_deparments"
                        :key="d.id"
                        :value="d.name"
                    >
                        {{ $t(d.name) }}
                    </option>
                </select>

                <div class="w-full flex justify-end mt-2">
                    <div
                        class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                        @click="handleApproval"
                    >
                        {{ $t("confirm") }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Schedule Modal -->
        <div v-if="is_add_schedule_modal_shown" class="">
            <div
                class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
            ></div>
            <div
                class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
            >
                <form>
                    <div class="font-bold w-full text-center">
                        {{ $t("added_schedule") }}
                    </div>
                    <div class="my-4 w-full">
                        <!-- 1. timestamp date (after tomorrow) -->
                        <div class="w-full font-bold">
                            {{ $t("date") }}
                        </div>
                        <input
                            type="date"
                            id="timestamp"
                            name="timestamp"
                            v-model="added_schedule.timestamp"
                            class="w-full text-center p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                            :min="minDate"
                            required
                        />

                        <!-- 1.1 time -->
                        <div class="w-full font-bold mt-3">
                            {{ $t("time") }}
                        </div>
                        <select
                            id="time"
                            name="time"
                            v-model="added_schedule.time"
                            class="w-full text-center p-2 bg-transparent focus:outline-none border-b border-gray/50 cursor-pointer"
                        >
                            <option
                                v-for="timeSlot in timeSlots"
                                :key="timeSlot"
                                :value="timeSlot"
                            >
                                {{ timeSlot }}
                            </option>
                        </select>

                        <!-- 2. mp_id (NO DISPLAY) -->

                        <!-- 3. department -->
                        <div class="w-full font-bold mt-3">
                            {{ $t("department") }}
                        </div>
                        <select
                            required
                            name="departments"
                            id="departments"
                            v-model="added_schedule.department"
                            class="w-full bg-transparent text-center border-b border-gray/50 p-2 cursor-pointer focus:outline-none"
                        >
                            <option
                                v-for="d in predefined_deparments"
                                :key="d.id"
                                :value="d.id"
                            >
                                {{ $t(d.name) }}
                            </option>
                        </select>

                        <!-- 4. patient_id (NEED VERIFICATION IN BACK)-->
                        <div class="w-full font-bold mt-3">
                            {{ $t("patient_id") }}
                        </div>
                        <input
                            class="focus:outline-none p-2 text-center w-full bg-transparent border-b border-gray/50"
                            type="text"
                            v-model="added_schedule.patient_id"
                            required
                        />

                        <!-- 5. symptoms  -->
                        <div class="w-full font-bold mt-3">
                            {{ $t("symptoms") }}
                        </div>
                        <select
                            multiple
                            required
                            name="departments"
                            id="departments"
                            v-model="added_schedule.symptoms"
                            class="w-full bg-transparent text-center border-b border-gray/50 p-2 cursor-pointer focus:outline-none"
                        >
                            <option
                                v-for="(d, index) in predefined_symptoms"
                                :key="index"
                                :value="d.id"
                                class="py-2"
                                :class="{
                                    'border-b border-gray/20':
                                        index !==
                                        predefined_symptoms.length - 1,
                                }"
                            >
                                {{ $t(d.name) }}
                            </option>
                        </select>
                        <div class="w-full italic text-red text-[12px]">
                            {{
                                $t(
                                    "*Hold down the Ctrl (windows) or Command (Mac) button to select multiple options."
                                )
                            }}
                        </div>
                    </div>
                    <div
                        class="w-full flex justify-end mt-2 items-center gap-2"
                    >
                        <div
                            class="p-2 py-1 cursor-pointer transition hover:text-red hover:underline"
                            @click="closeAddScheduleModal"
                        >
                            {{ $t("cancel") }}
                        </div>
                        <button
                            class="bg-red p-2 py-1 text-white cursor-pointer transition hover:bg-darkred"
                            @click="handleAddSchedule"
                            type="submit"
                        >
                            {{ $t("confirm") }}
                        </button>
                    </div>
                </form>
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
                class="w-full h-full flex justify-center"
                :class="{
                    'pl-[180px]': is_sidebar_expanding,
                    'pl-[60px]': !is_sidebar_expanding,
                }"
            >
                <div class="pt-6 pb-8 px-10 w-full h-fit max-w-[950px]">
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

                    <div class="flex justify-center w-full">
                        <div class="w-full p-2">
                            <!-- Summary span -->
                            <div class="w-full grid grid-cols-3 gap-2">
                                <!-- Incoming -->
                                <div
                                    class="w-full flex justify-center items-center flex-wrap bg-darkred p-2 text-white"
                                >
                                    <p>{{ incoming_schedules.length }}</p>
                                    <p class="w-full text-center">
                                        {{ $t("incoming") }}
                                    </p>
                                </div>

                                <!-- Completed -->
                                <div
                                    class="w-full flex justify-center items-center flex-wrap bg-blue p-2 text-white"
                                >
                                    <p>
                                        {{
                                            incoming_schedules.filter(
                                                (s) => s.is_processing
                                            ).length
                                        }}
                                    </p>
                                    <p class="w-full text-center">
                                        {{ $t("processing") }}
                                    </p>
                                </div>

                                <!-- Cancelled -->
                                <div
                                    class="w-full flex justify-center items-center flex-wrap bg-darkyellow p-2 text-white"
                                >
                                    <p>
                                        {{
                                            incoming_schedules.filter(
                                                (s) => s.is_cancelled
                                            ).length
                                        }}
                                    </p>
                                    <p class="w-full text-center">
                                        {{ $t("cancelled") }}
                                    </p>
                                </div>
                            </div>

                            <div class="w-full flex justify-end mt-2">
                                <div
                                    class="hover:bg-darkred transition cursor-pointer flex gap-2 items-center text-[16px] bg-red p-1 px-2 text-white shadow shadow-gray"
                                    @click="openAddScheduleModal"
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
                                        class="w-full grid grid-cols-5 text-[14px] my-2 bg-gray text-white"
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
                                        class="border-gray/70 transition cursor-pointer slide-in-left-to-right border w-full grid grid-cols-5 text-[14px] py-1 text-center"
                                        v-for="(h, index) in incoming_schedules"
                                        :key="index"
                                        :class="{
                                            'border-b-0':
                                                index !==
                                                incoming_schedules.length - 1,
                                            'bg-yellow hover:bg-yellow/80 ':
                                                h.is_cancelled,
                                            'bg-blue/70 hover:bg-blue/60':
                                                h.is_processing,
                                            'bg-green hover:bg-green/80':
                                                h.is_completed,
                                            'bg-red hover:bg-red/80':
                                                h.is_rescheduled,
                                        }"
                                        :style="{
                                            'animation-delay': `${
                                                0.1 + index * 0.2
                                            }s`,
                                        }"
                                    >
                                        <div
                                            class="flex justify-center items-center hover:underline transition"
                                            @click="showScheduleInfo(h)"
                                        >
                                            {{ h.schedule_id }}
                                        </div>
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.patient_id }}
                                        </div>
                                        <div
                                            class="flex justify-center items-center"
                                        >
                                            {{ h.name }}
                                        </div>
                                        <!-- Actions button -->
                                        <div
                                            class="col-span-2 w-full flex justify-center"
                                        >
                                            <div
                                                class="flex justify-center items-center gap-2 p-1 w-1/2"
                                            >
                                                <div
                                                    class="border-r pr-2 border-gray/70 hover:text-darkyellow transition hover:underline"
                                                    @click="cancelSchedule(h)"
                                                    v-if="
                                                        !(
                                                            h.is_cancelled ||
                                                            h.is_processing ||
                                                            h.is_completed ||
                                                            h.is_rescheduled
                                                        )
                                                    "
                                                >
                                                    {{ $t("cancel") }}
                                                </div>
                                                <div
                                                    class="border-r pr-2 border-gray/70 hover:text-blue transition hover:underline"
                                                    @click="processSchedule(h)"
                                                    v-if="
                                                        !(
                                                            h.is_cancelled ||
                                                            h.is_processing ||
                                                            h.is_completed ||
                                                            h.is_rescheduled
                                                        )
                                                    "
                                                >
                                                    {{ $t("processing") }}
                                                </div>
                                                <div
                                                    class="border-r pr-2 border-gray/70 hover:text-darkgreen transition hover:underline"
                                                    @click="completeSchedule(h)"
                                                    :class="{
                                                        'border-none':
                                                            h.is_processing,
                                                    }"
                                                    v-if="
                                                        h.is_processing &&
                                                        !h.is_completed
                                                    "
                                                >
                                                    {{ $t("complete") }}
                                                </div>
                                                <div
                                                    class="hover:text-red transition hover:underline"
                                                    @click="reschedule(h)"
                                                    v-if="
                                                        !(
                                                            h.is_cancelled ||
                                                            h.is_processing ||
                                                            h.is_completed ||
                                                            h.is_rescheduled
                                                        )
                                                    "
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
                                        class="w-full grid grid-cols-5 text-[14px] my-2 bg-gray text-white"
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
                                        class="border-gray/70 hover:bg-gray/10 transition cursor-pointer slide-in-left-to-right border w-full grid grid-cols-5 text-[14px] py-1 text-center"
                                        v-for="(h, index) in pending_schedules"
                                        :key="index"
                                        :class="{
                                            'border-b-0':
                                                index !==
                                                pending_schedules.length - 1,
                                        }"
                                        :style="{
                                            'animation-delay': `${
                                                0.1 + index * 0.2
                                            }s`,
                                        }"
                                    >
                                        <div
                                            class="flex justify-center items-center truncate"
                                        >
                                            {{ h.patient_id }}
                                        </div>

                                        <div
                                            class="flex justify-center items-center truncate"
                                        >
                                            {{
                                                formatDateTime(
                                                    h.timestamp,
                                                    true
                                                )
                                            }}
                                        </div>
                                        <div
                                            class="w-full flex justify-center items-center"
                                        >
                                            <div
                                                class="flex justify-center items-center w-fit h-full bg-gray text-white px-3 p-1 transition hover:bg-black"
                                                @click="openPendingModal(h)"
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
                                                    @click="denySchedule(h)"
                                                >
                                                    {{ $t("deny") }}
                                                </div>
                                                <div
                                                    class="hover:text-darkgreen transition hover:underline"
                                                    @click="approveSchedule(h)"
                                                >
                                                    {{ $t("approve") }}
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
            selected_schedule: null,
            denied_reason: null,
            is_verified: true, // false in default
            is_initiated: true, // false in default
            is_schedule_shown: false,
            is_access_denied: false,
            is_sidebar_expanding: false,
            is_pending_modal_shown: false,
            is_denied_schedule_modal_shown: false,
            is_approved_schedule_modal_shown: false,
            is_add_schedule_modal_shown: false,
            added_schedule: {
                timestamp: null,
                time: null,
                mp_id: null,
                patient_id: null,
                symptoms: null,
            },
            selected_events: [],
            selected_tab: "incoming",
            predefined_symptoms: null,
            predefined_deparments: null,
            assigned_department: null,
            api_url: "http://127.0.0.1:3000",
            records: [],
            schedules: null,
            tabs: ["incoming", "pending"],
            incoming_headers: [
                "schedule_id",
                "patient_id",
                "patient_name",
                "action",
            ],
            pending_headers: ["patient_id", "date", "info", "action"],
            incoming_schedules: [],
            pending_schedules: [],
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
        // Calculate the date after the day after tomorrow
        minDate() {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 2); // Add two days
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const day = currentDate.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        timeSlots() {
            const startTime = 9 * 60; // 09:00 in minutes
            const endTime = 17 * 60; // 18:00 in minutes
            const interval = 30; // 30 minutes interval

            const timeSlots = [];

            for (let time = startTime; time <= endTime; time += interval) {
                const hours = Math.floor(time / 60);
                const minutes = time % 60;
                const formattedTime = `${hours
                    .toString()
                    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                timeSlots.push(formattedTime);
            }

            return timeSlots;
        },
    },

    methods: {
        openAddScheduleModal() {
            this.added_schedule.timestamp = null;
            this.added_schedule.mp_id = this.user.id;
            this.added_schedule.patient_id = null;
            this.added_schedule.symptoms = null;
            this.is_add_schedule_modal_shown = true;
        },
        closeAddScheduleModal() {
            this.is_add_schedule_modal_shown = false;
        },
        async handleAddSchedule() {
            this.added_schedule.symptoms =
                this.added_schedule.symptoms.join(";");

            this.added_schedule.timestamp =
                this.added_schedule.timestamp +
                " " +
                this.added_schedule.time +
                ":00";

            console.log(this.added_schedule);

            const response = await this.axios.post(
                `${this.api_url}/add-schedule`,
                {
                    data: this.added_schedule,
                },
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );
            if (response.data.message)
                this.$swal({
                    title: "Schedule",
                    text: "New schedule added successfully.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
            else {
                this.$swal({
                    title: "Schedule",
                    text: "New schedule added failed.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }

            this.closeAddScheduleModal();
        },
        async handleApproval() {
            const dep_id = this.predefined_deparments.filter(
                (d) => d.name === this.assigned_department
            )[0].id;
            const response = await this.axios.post(
                `${this.api_url}/assign-schedule`,
                {
                    department_id: dep_id,
                    schedule_id: this.selected_schedule.schedule_id,
                },
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            if (response.data.message) await this.fetch();

            this.notifyUser("SCHEDULE APPROVED", this.assigned_department);
        },
        // Notification connection here
        async notifyUser(eType, msg) {
            if (eType === "SCHEDULE DENIED")
                this.is_denied_schedule_modal_shown = false;
            if (eType === "SCHEDULE APPROVED") {
                this.is_approved_schedule_modal_shown = false;
            }
            console.log(eType, msg);
        },
        getSymptoms(ss) {
            return ss
                .split(";")
                .map((num) => this.predefined_symptoms[parseInt(num)].name);
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
        closeScheduleInfo() {
            this.is_schedule_shown = false;
            this.selected_schedule = null;
        },
        showScheduleInfo(e) {
            this.is_schedule_shown = true;
            this.selected_schedule = e;
        },
        async denySchedule(e) {
            this.is_denied_schedule_modal_shown = true;
            this.schedule("deny", e);
        },
        async approveSchedule(e) {
            this.selected_schedule = e;
            this.is_approved_schedule_modal_shown = true;
            this.schedule("approve", e);
        },
        async cancelSchedule(e) {
            this.schedule("cancel", e);
        },
        async processSchedule(e) {
            this.schedule("process", e);
        },
        async completeSchedule(e) {
            this.schedule("complete", e);
        },
        async reschedule(e) {
            this.schedule("reschedule", e);
        },
        async schedule(type, e) {
            const response = await this.axios.post(
                `${this.api_url}/update-schedule/${type}/${e.schedule_id}`,
                {},
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );
            await this.fetch();
        },
        async fetch() {
            try {
                // If the mp has access right on handling incoming
                const response = await this.axios.get(
                    this.api_url + "/schedule-management/incoming",
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                this.incoming_schedules = response.data.message.filter((s) =>
                    this.$dayjs(s.timestamp).isSame(new Date(), "day")
                );

                // If the mp has access right on handling pending
                const response_pending = await this.axios.get(
                    this.api_url + "/schedule-management/pending",
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                this.pending_schedules = response_pending.data.message;
                const desiredKeyOrder = [
                    "is_approved",
                    "is_assigned",
                    "is_cancelled",
                    "is_completed",
                    "is_processing",
                    "is_rescheduled",
                    "name",
                    "patient_id",
                    "schedule_id",
                    "timestamp",
                    "symptoms",
                ];

                this.pending_schedules = this.pending_schedules.map((s) =>
                    this.reorderKeys(s, desiredKeyOrder)
                );

                if (!this.predefined_symptoms) {
                    const response_sym = await this.axios.get(
                        this.api_url + "/symptoms",
                        {
                            headers: {
                                Authorization: this.user.passcode,
                            },
                        }
                    );
                    this.predefined_symptoms = response_sym.data.message;
                }

                if (!this.predefined_deparments) {
                    const response_dep = await this.axios.get(
                        this.api_url + "/departments",
                        {
                            headers: {
                                Authorization: this.user.passcode,
                            },
                        }
                    );
                    this.predefined_deparments = response_dep.data.message;
                }
            } catch (e) {
                console.error(e.message);
            }
        },
        reorderKeys(obj, keyOrder) {
            const orderedObject = {};

            // Add all keys except the one specified in keyOrder
            for (const key in obj) {
                if (!keyOrder.includes(key)) {
                    orderedObject[key] = obj[key];
                }
            }

            // Add the specified key at the end
            keyOrder.forEach((key) => {
                if (obj.hasOwnProperty(key)) {
                    orderedObject[key] = obj[key];
                }
            });

            return orderedObject;
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        closePendingModal() {
            this.is_pending_modal_shown = false;
            this.selected_schedule = null;
        },
        openPendingModal(s) {
            this.is_pending_modal_shown = true;
            this.selected_schedule = s;
        },
    },
};
</script>

<style></style>
