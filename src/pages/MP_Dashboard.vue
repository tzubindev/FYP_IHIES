<template>
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

            <!-- Dashboard -->
            <div
                class="w-full h-full flex justify-center"
                :class="{
                    'pl-[180px]': is_sidebar_expanding,
                    'pl-[60px]': !is_sidebar_expanding,
                }"
            >
                <div class="pt-6 pb-4 px-10 w-full h-fit max-w-[1050px]">
                    <!-- Path showing -->
                    <div
                        class="h-[40px] w-full font-extrabold p-2 text-xs flex justify-center"
                    >
                        <div
                            class="w-full max-w-[1140px] flex items-center justify-start"
                        >
                            <p>{{ $t("healthie") }}</p>
                            <p class="mx-1.5">&gt;</p>
                            <p>{{ $t("dashboard") }}</p>
                        </div>
                    </div>

                    <!-- Profile card & Quick Access button -->
                    <div
                        class="w-full h-fit justify-center grid grid-cols-2 gap-2"
                    >
                        <div
                            class="h-full text-[12px] py-8 bg-gray text-white w-full flex text-center flex-wrap justify-center items-center"
                        >
                            <img
                                :src="profile_picture_url"
                                class="w-[250px] h-[250px] rounded-full"
                            />
                            <div class="w-full mt-3 text-[18px]">
                                {{ this.user.name }}
                            </div>
                            <div class="w-full text-white/70">
                                @{{ this.user.id }}
                            </div>
                            <div
                                class="cursor-pointer transition p-2 px-4 border border-red text-red hover:bg-red hover:text-white mt-3"
                            >
                                {{ $t("view_profile") }}
                            </div>
                        </div>

                        <!-- View PMR & Create Vital Sign  -->
                        <div class="grid grid-cols-1 gap-2">
                            <!-- View PMR -->
                            <div
                                class="cursor-pointer transition hover:shadow w-full shadow-gray/40 shadow-md overflow-hidden relative"
                                @click="this.leadTo('patient-medical-record')"
                            >
                                <img
                                    src="../assets/medical_record.jpg"
                                    class="h-full w-full object-cover"
                                    alt="Medical Record"
                                />
                                <div
                                    class="absolute inset-0 bg-gray opacity-60"
                                ></div>
                                <div
                                    class="hover:bg-gray/40 transition text-center text-white absolute inset-0 flex justify-center items-center font-extrabold lg:text-[30px] text-[20px]"
                                >
                                    {{ $t("view_patient_medical_record") }}
                                </div>
                            </div>

                            <!-- Vital Sign -->
                            <div
                                class="h-[145px] cursor-pointer transition hover:shadow w-full shadow-gray/40 shadow-md overflow-hidden relative"
                                @click="openVitalSignModal"
                            >
                                <img
                                    src="../assets/vital_sign_bg.jpg"
                                    class="h-full w-full object-cover"
                                    alt="Medical Record"
                                />
                                <div
                                    class="absolute inset-0 bg-gray opacity-80"
                                ></div>
                                <div
                                    class="hover:bg-gray/60 transition text-center text-white absolute inset-0 flex justify-center items-center font-extrabold lg:text-[30px] text-[20px]"
                                >
                                    {{ $t("create_vital_sign") }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Time span and schedule summary -->
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <!-- Time span -->
                        <div
                            class="p-2 pb-4 bg-darkred text-white shadow shadow-gray flex flex-wrap justify-center text-center"
                        >
                            <!-- HH:MM:SS - keep changing every second-->
                            <div class="w-full text-[40px]">
                                {{ current_time[1] }}
                            </div>
                            <!-- Date -->
                            <div class="text-[14px]">
                                {{ current_time[0] }}
                            </div>
                        </div>

                        <!-- Schedule -->
                        <div
                            class="hover:bg-gray hover:text-white cursor-pointer transition p-2 pb-4 bg-white text-gray shadow shadow-gray flex flex-wrap justify-center text-center"
                            @click="this.leadTo('schedule-management')"
                        >
                            <!-- Schedule -->
                            <div class="w-full text-[40px]">
                                {{ schedule_number }}
                            </div>
                            <!-- label -->
                            <div class="text-[14px]">{{ $t("schedule") }}</div>
                        </div>
                    </div>
                </div>

                <!-- Vital Sign Modal -->
                <Transition>
                    <div v-if="is_vitalsign_modal_shown" class="">
                        <div
                            class="absolute top-0 left-0 z-40 w-full h-full bg-gray/90"
                        ></div>
                        <div
                            class="text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 w-full min-w-[50%] max-w-[400px]"
                        >
                            <div class="relative">
                                <img
                                    src="../assets/vital_sign_bg.jpg"
                                    class="w-full h-[220px]"
                                />
                                <div
                                    class="w-full h-[220px] bg-gray/60 absolute top-0 backdrop-filter backdrop-blur-sm"
                                ></div>
                                <div
                                    class="absolute top-1/2 left-1/2 font-bold text-white -translate-x-1/2 -translate-y-1/2 text-[30px]"
                                >
                                    {{ $t("vital_sign") }}
                                </div>
                            </div>
                            <div class="p-4">
                                <div
                                    class="flex my-2 gap-2 items-center flex-wrap"
                                >
                                    <div class="w-full">
                                        <p>{{ $t("patient_id") }}</p>
                                        <input
                                            type="text"
                                            v-model="vital_sign.patient_id"
                                            class="text-[18px] py-1.5 text-center focus:outline-none bg-gray/10 shadow shadow-gray w-full"
                                        />
                                    </div>
                                    <div class="w-full">
                                        <p>{{ $t("sys") }}</p>
                                        <input
                                            type="text"
                                            v-model="vital_sign.sys"
                                            class="text-[18px] py-1.5 text-center focus:outline-none bg-gray/10 shadow shadow-gray w-full"
                                        />
                                    </div>
                                    <div class="w-full">
                                        <p>{{ $t("dia") }}</p>
                                        <input
                                            type="text"
                                            v-model="vital_sign.dia"
                                            class="text-[18px] py-1.5 text-center focus:outline-none bg-gray/10 shadow shadow-gray w-full"
                                        />
                                    </div>
                                    <div class="w-full">
                                        <p>{{ $t("pulse") }}</p>
                                        <input
                                            type="text"
                                            v-model="vital_sign.pulse"
                                            class="text-[18px] py-1.5 text-center focus:outline-none bg-gray/10 shadow shadow-gray w-full"
                                        />
                                    </div>
                                    <div class="w-full">
                                        <p>{{ $t("breath") }}</p>
                                        <input
                                            type="text"
                                            v-model="vital_sign.breath"
                                            class="text-[18px] py-1.5 text-center focus:outline-none bg-gray/10 shadow shadow-gray w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="p-2 flex justify-end items-center gap-4"
                            >
                                <div
                                    class="cursor-pointer transition hover:text-red hover:underline text-center"
                                    @click="cancelSubmitVitalSign"
                                >
                                    {{ $t("cancel") }}
                                </div>
                                <div
                                    class="cursor-pointer transition hover:bg-blue bg-darkgreen text-white shadow shadow-gray w-1/2 text-center py-1"
                                    @click="submitVitalSign"
                                >
                                    {{ $t("confirm") }}
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            user: {
                id: null,
                name: "",
                passcode: null,
            },
            vital_sign: {
                patient_id: null,
                sys: null,
                dia: null,
                pulse: null,
                breath: null,
            },
            current_time: this.getCurrentTime(),
            schedule_number: "N/A",
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            is_sidebar_expanding: false,
            is_vitalsign_modal_shown: false,
            api_url: "http://127.0.0.1:3000",
        };
    },
    async created() {
        this.user.passcode = await sessionStorage.getItem("passcode");
        const obtainedUser = await JSON.parse(sessionStorage.getItem("user"));
        this.user.id = obtainedUser.id;
        this.user.role = obtainedUser.role;

        await this.fetch();

        this.updateTime();
        setInterval(this.updateTime, 1000);
    },

    methods: {
        validateVitalSigns() {
            const errors = [];

            // Check if sys is present and is a positive number

            if (!this.vital_sign.patient_id) {
                errors.push("No patient id.");
            }

            if (
                this.vital_sign.sys === null ||
                isNaN(this.vital_sign.sys) ||
                this.vital_sign.sys <= 0
            ) {
                errors.push("Sys must be a positive number.");
            }

            // Check if dia is present and is a positive number
            if (
                this.vital_sign.dia === null ||
                isNaN(this.vital_sign.dia) ||
                this.vital_sign.dia <= 0
            ) {
                errors.push("Dia must be a positive number.");
            }

            // Check if pulse is present and is a positive number
            if (
                this.vital_sign.pulse === null ||
                isNaN(this.vital_sign.pulse) ||
                this.vital_sign.pulse <= 0
            ) {
                errors.push("Pulse must be a positive number.");
            }

            // Check if breath is present and is a positive number
            if (
                this.vital_sign.breath === null ||
                isNaN(this.vital_sign.breath) ||
                this.vital_sign.breath <= 0
            ) {
                errors.push("Breath must be a positive number.");
            }

            return errors;
        },
        async submitVitalSign() {
            // Validation
            const errors = this.validateVitalSigns();

            if (errors.length) {
                const msg = errors.join("<br>");
                this.$swal({
                    title: "Submission Failed",
                    html: msg,
                    icon: "error",
                    showConfirmButton: false,
                    timer: 3000,
                });
            } else {
                const response = await this.axios.post(
                    this.api_url + "/vital-sign/add",
                    this.vital_sign, // Sending data directly in the request body
                    {
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                if (response.data.message > 0) {
                    this.$swal({
                        title: "Success",
                        text: "Vital signs are sucessfully added.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }

                console.log(response);
            }

            this.resetVSModal();
        },
        cancelSubmitVitalSign() {
            this.is_vitalsign_modal_shown = false;
            this.resetVSModal();
        },
        resetVSModal() {
            Object.keys(this.vital_sign).forEach(
                (k) => (this.vital_sign[k] = null)
            );
        },
        openVitalSignModal() {
            this.is_vitalsign_modal_shown = true;
        },
        async fetch() {
            console.log("FETCH");
            this.is_verified = false;
            this.is_access_denied = false;
            this.is_initiated = false;

            if (!this.user.passcode) {
                this.is_access_denied = true;
            } else {
                // LAST CHECK
                if (!(this.user.passcode && this.user.id && this.user.role)) {
                    this.is_verified = true;
                    this.is_access_denied = true;
                    this.is_initiated = false;
                    return;
                }

                console.log("LAST CHECK FINISHED");
                try {
                    const response = await this.axios.get(
                        `${this.api_url}/profile`,
                        {
                            headers: {
                                Authorization: this.user.passcode,
                            },
                            data: {
                                user: this.user,
                            },
                        }
                    );

                    console.log("Start Initiation");
                    this.is_verified = true;
                    await this.initiateDashboard(response.data.message.profile);
                    this.is_initiated = true;
                } catch (error) {
                    console.error("An error occurred:", error);
                    this.is_initiated = false;
                    this.is_access_denied = true;
                }
            }
        },
        async initiateDashboard(profile) {
            // Format
            //  name: null,
            //  sex: null,
            //  age: null,
            //  blood: null,
            //  height: null,
            //  weight: null,
            //  last: null,

            // Initialise Language
            this.$i18n.locale = profile.language;
            // Initial Profile Picture
            this.profile_picture_url = `data:${profile.picture.mimetype};base64,${profile.picture.buffer}`;

            // Standardise
            profile.age = this.calculateAge(profile.born_date);
            profile.last = this.formatDateTime(profile.last);
            delete profile.language;
            delete profile.born_date;

            // Initiation
            this.profile = profile;
            console.log(this.profile);
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        calculateAge(birthDateString) {
            const birthDate = new Date(birthDateString);
            const currentDate = new Date();

            // Calculate the difference in years
            let age = currentDate.getFullYear() - birthDate.getFullYear();

            // Check if the birthday has occurred this year
            if (
                currentDate.getMonth() < birthDate.getMonth() ||
                (currentDate.getMonth() === birthDate.getMonth() &&
                    currentDate.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            return age;
        },
        formatDateTime(isoString) {
            const date = new Date(isoString);

            // Get individual date and time components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");

            // Create the formatted string
            const formattedDateTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

            return formattedDateTime;
        },
        updateTime() {
            this.current_time = this.getCurrentTime();
        },
        getCurrentTime() {
            const now = new Date();
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            };
            return now.toLocaleDateString("en-UK", options).split(" at ");
        },
        leadTo(des) {
            this.$router.push({
                path: `/${des}/${this.user.id}`,
            });
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
