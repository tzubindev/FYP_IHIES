<template>
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-100 absolute w-full h-screen bg-black text-red flex justify-center items-center"
        >
            <p class="access-denied-text font-extrabold">ACCESS DENIED</p>
        </div>

        <Loader
            :loading="!(is_verified && is_initiated) && !is_access_denied"
            class="w-4/5 z-30 absolute"
            v-if="!(is_verified && is_initiated) && !is_access_denied"
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
                medicalPersonnel
                @toggled="updateSidebarExpansion"
            ></Sidebar>

            <!-- Topbar -->
            <Topbar></Topbar>

            <!-- Dashboard -->
            <div
                class="w-full h-full grid-cols-3 grid"
                :class="{
                    'pl-[180px]': is_sidebar_expanding,
                    'pl-[60px]': !is_sidebar_expanding,
                }"
            >
                <div
                    class="pt-6 pb-4 px-10 w-full h-fit col-span-3 lg:col-span-2"
                >
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

                    <!-- Profile card & MR quick access -->
                    <div
                        class="w-full h-fit justify-center grid grid-cols-2 gap-2"
                    >
                        <div
                            class="text-[12px] py-8 bg-gray text-white w-full flex text-center flex-wrap justify-center items-center"
                        >
                            <img
                                src="../sample_assets/profilePic_tb.jpg"
                                class="w-[150px] h-[150px] rounded-full"
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

                        <!-- Check Patient MR Button -->
                        <div
                            class="h-full cursor-pointer transition hover:shadow w-full max-w-[1140px] shadow-gray/40 shadow-md overflow-hidden relative"
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
                                class="hover:bg-gray/40 text-white absolute inset-0 flex justify-center items-center font-extrabold lg:text-[30px] text-[30px]"
                            >
                                {{ $t("view_patient_medical_record") }}
                            </div>
                        </div>
                    </div>

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

                <!-- Right Sidebar -->
                <div class="hidden lg:block bg-black"></div>
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
                name: null,
                passcode: null,
            },
            current_time: this.getCurrentTime(),
            schedule_number: "N/A",

            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            is_sidebar_expanding: false,
            api_url: "http://127.0.0.1:3000",
        };
    },
    async created() {
        console.log("CREATED");
    },
    async mounted() {
        console.log("MOUNTED");

        this.user.passcode = await sessionStorage.getItem("passcode");
        // Remove the item from sessionStorage
        // UNCOMMENT
        // sessionStorage.removeItem("passcode");

        if (!this.user.passcode) {
            this.is_access_denied = true;
        } else {
            this.user.id = this.$route.params.id;
            console.log(this.user.id);
            console.log(this.user.passcode);

            if (!(this.user.passcode && this.user.id)) {
                this.is_verified = true;
                this.is_access_denied = true;
                this.is_initiated = false;
                return;
            }

            try {
                const response = await this.axios.post(
                    `${this.api_url}/username`,
                    this.user
                );
                console.log("Start verification");

                this.is_verified = true;

                if (response.data.message.passcode_verification) {
                    this.user.name = response.data.message.name;
                    this.is_access_denied = false;
                } else {
                    this.is_initiated = false;
                    this.is_access_denied = true;
                }

                if (!this.is_access_denied) {
                    // Get user preference language
                    const localeResponse = await this.axios.get(
                        `${this.api_url}/locale/${this.user.id}`
                    );
                    console.log(localeResponse);

                    this.$i18n.locale = localeResponse.data.message.locale;
                    this.is_initiated = true;
                }
            } catch (error) {
                console.error("An error occurred:", error);
                // Handle error as needed
            }
        }

        this.updateTime();
        setInterval(this.updateTime, 1000);
    },

    methods: {
        async initiateDashboard(id) {
            this.$axios();
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
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
            switch (des) {
                case "schedule-management":
                    this.$router.push({
                        path: `/schedule-management/${this.user.id}`,
                    });
                    break;
            }
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
