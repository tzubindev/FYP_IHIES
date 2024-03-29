<template>
    <transition>
        <div
            class="absolute w-full h-full bg-white/70 z-30"
            v-if="is_expanding"
            @click="toggleExpanding"
        ></div
    ></transition>
    <div
        class="overflow-y-auto overflow-x-hidden z-40 bg-gray text-white fixed top-0 bottom-0 text-center"
        :class="{
            'w-[180px] ': is_expanding,
            'w-[70px] ': !is_expanding,
        }"
    >
        <!-- Company Logo -->
        <transition>
            <div
                class="p-4 pt-0 flex flex-wrap justify-start items-center text-gray text-xl h-[200px] bg-white"
                v-if="is_expanding"
            >
                <h1 class="z-10 w-full font-extrabold text-gray text-sm">
                    {{ $t("healthie") }}
                </h1>

                <div
                    class="z-10 w-full flex flex-wrap items-center justify-start mt-6"
                >
                    <p class="text-sm w-full">{{ this.$t("good_day") }}</p>

                    <p class="text-sm w-full font-bold">
                        {{ username }}
                    </p>
                </div>

                <div
                    class="absolute -left-[60px] top-[60px] w-[200px] h-[140px] bg-orange rounded-t-full"
                ></div>

                <div
                    class="absolute left-[40px] top-[60px] w-[140px] h-[140px] bg-red rounded-tl-full"
                ></div>

                <div
                    class="absolute left-[110px] top-[130px] w-[70px] h-[70px] bg-gradient-to-br from-red to-white/40 rounded-tl-full"
                ></div>
            </div>
        </transition>

        <!-- Side bar bottom part -->
        <div class="z-10 p-2 pt-0 mt-3 mb-10">
            <!-- Search Box -->
            <div
                class="hover:bg-black/40 p-1 flex justify-center items-center px-4 duration-300 cursor-pointer bg-white/40"
                @click="openSearchbox"
                ref="searchInput"
                v-if="is_expanding"
            >
                <img src="../assets/search.svg" class="w-4 h-4" />
                <transition name="slide-fade">
                    <input
                        type="text"
                        :placeholder="`${$t('search')}`"
                        v-if="is_searching"
                        class="cursor-pointer text-[14px] ml-4 w-full bg-transparent placeholder:text-white focus:outline-none"
                    />
                </transition>
            </div>

            <!-- Feature Buttons - Patient -->
            <div
                class="grid grid-cols-1 mt-3 gap-1 p-1 bg-white/10 shadow-xl"
                v-if="!medicalPersonnel"
            >
                <!-- Dashboard -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-2 justify-center ': !is_expanding,
                    }"
                    @click="this.leadTo('dashboard/patient')"
                >
                    <img src="../assets/dashboard.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold"
                        v-if="is_expanding"
                        >{{ $t("dashboard") }}</span
                    >
                </div>

                <!-- Medical record -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center  my-1': !is_expanding,
                    }"
                    @click="this.leadTo('medical-record')"
                >
                    <img src="../assets/record.svg" class="w-4 h-4" />
                    <span
                        class="text-[12px] ml-3 font-bold text-left"
                        v-if="is_expanding"
                        >{{ $t("medical_record") }}</span
                    >
                </div>

                <!-- Inquiry -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center  my-1': !is_expanding,
                    }"
                    @click="this.leadTo('inquiry')"
                >
                    <img src="../assets/inquiry.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold"
                        v-if="is_expanding"
                        >{{ $t("inquiry") }}</span
                    >
                </div>

                <!-- Schedule -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center  my-1': !is_expanding,
                    }"
                    @click="this.leadTo('schedule')"
                >
                    <img src="../assets/schedule.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold"
                        v-if="is_expanding"
                        >{{ $t("schedule") }}</span
                    >
                </div>

                <!-- Setting -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center  my-1': !is_expanding,
                    }"
                >
                    <img src="../assets/setting.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold"
                        v-if="is_expanding"
                        >{{ $t("setting") }}</span
                    >
                </div>
            </div>

            <!-- Feature Buttons - Medical Personnel -->
            <div
                class="grid grid-cols-1 mt-3 gap-1 p-1 bg-white/10 shadow-xl"
                v-if="medicalPersonnel"
            >
                <!-- Dashboard -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center ': !is_expanding,
                    }"
                    @click="this.leadTo('dashboard/medical-personnel')"
                >
                    <img src="../assets/dashboard.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold"
                        v-if="is_expanding"
                        >{{ $t("dashboard") }}</span
                    >
                </div>

                <!-- Manage Schedule -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center  my-1': !is_expanding,
                    }"
                    @click="this.leadTo('schedule-management')"
                >
                    <img src="../assets/schedule.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold text-left"
                        v-if="is_expanding"
                        >{{ $t("schedule_management") }}</span
                    >
                </div>

                <!-- Patient Transfer -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center  my-1': !is_expanding,
                    }"
                    @click="this.leadTo('patient-transfer')"
                >
                    <img src="../assets/transfer.svg" class="w-4 h-4" />
                    <span
                        class="text-[12px] ml-3 font-bold text-left"
                        v-if="is_expanding"
                        >{{ $t("patient_transfer") }}</span
                    >
                </div>

                <!-- Incident Report Channel -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center my-1': !is_expanding,
                    }"
                    @click="this.leadTo('incident-report-channel')"
                >
                    <img src="../assets/report.svg" class="w-4 h-4" />
                    <span
                        class="text-[12px] ml-3 font-bold text-left"
                        v-if="is_expanding"
                        >{{ $t("incident_report_channel") }}</span
                    >
                </div>

                <!-- Patient Medical Record -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center my-1': !is_expanding,
                    }"
                    @click="this.leadTo('patient-medical-record')"
                >
                    <img src="../assets/record.svg" class="w-4 h-4" />
                    <span
                        class="text-[12px] ml-3 font-bold text-left"
                        v-if="is_expanding"
                        >{{ $t("patient_medical_record") }}</span
                    >
                </div>

                <!-- Access Management -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center my-1': !is_expanding,
                    }"
                    @click="this.leadTo('access-management')"
                >
                    <img src="../assets/access.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold text-left"
                        v-if="is_expanding"
                        >{{ $t("access_management") }}</span
                    >
                </div>

                <!-- Setting -->
                <div
                    class="hover:bg-black transition flex items-center cursor-pointer"
                    :class="{
                        'p-2': is_expanding,
                        'p-1.5 justify-center my-1': !is_expanding,
                    }"
                >
                    <img src="../assets/setting.svg" class="w-4 h-4" />
                    <span
                        class="text-[13px] ml-3 font-bold"
                        v-if="is_expanding"
                        >{{ $t("setting") }}</span
                    >
                </div>
            </div>

            <!-- Logout -->
            <div
                class="mt-3 bg-red hover:bg-red/40 transition flex items-center cursor-pointer"
                :class="{
                    'p-2  justify-start': is_expanding,
                    'p-2 justify-center  ': !is_expanding,
                }"
                @click="logout"
            >
                <img src="../assets/logout.svg" class="w-4 h-4" />
                <span class="text-[14px] ml-3 font-bold" v-if="is_expanding">{{
                    $t("logout")
                }}</span>
            </div>
        </div>

        <!-- Menu icon -->
        <div
            class="bg-gray flex justify-center p-2 bottom-0 fixed"
            :class="{
                'w-[180px]  pl-0': is_expanding,
                'w-[60px]   pl-3': !is_expanding,
            }"
        >
            <img
                src="../assets/menu.svg"
                class="w-6 h-6 cursor-pointer"
                @click="toggleExpanding"
            />
        </div>
    </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>

<script>
export default {
    emits: ["toggled"],
    props: {
        username: {
            type: String,
            required: true,
        },
        medicalPersonnel: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            is_searching: false,
            is_expanding: false,
            user: {
                id: this.$route.params.id,
            },
            api_url: "http://127.0.0.1:3000",
        };
    },
    mounted() {
        // Add a click event listener to the document body
        document.body.addEventListener("click", this.closeSearchbox);
    },
    methods: {
        openSearchbox() {
            this.is_searching = true;
        },
        closeSearchbox(event) {
            // Check if the click target is not inside the search input
            if (
                this.$refs.searchInput &&
                !this.$refs.searchInput.contains(event.target)
            ) {
                this.is_searching = false;
            }
        },
        toggleExpanding() {
            this.is_expanding = !this.is_expanding;
            this.$emit("toggled", this.is_expanding);
        },
        leadTo(des) {
            if (des !== "login") this.$router.push(`/${des}/${this.user.id}`);
            else this.$router.push(`/${des}`);
        },
        async logout() {
            await this.axios.put(`${this.api_url}/last-login`, {
                data: {
                    user: await JSON.parse(sessionStorage.getItem("user")),
                },
            });
            await sessionStorage.clear();
            await localStorage.clear();

            this.leadTo("login");
        },
    },
};
</script>
