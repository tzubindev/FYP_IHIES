<template>
    <div class="max-w-[1000px] w-full mx-auto grid grid-cols-2 gap-4">
        <!-- Risk Analysis -->
        <div class="w-full h-fit p-1 px-3 flex col-span-2 flex-wrap">
            <!-- Title -->
            <div class="text-xs font-semibold p-2">
                {{ $t("risk_analysis") }}
            </div>

            <!-- Analysis Cards -->
            <div class="grid grid-cols-4 gap-2 w-full">
                <div
                    v-for="(r, index) in risk_analysis"
                    :key="index"
                    class="col-span-2 lg:col-span-1"
                >
                    <Card
                        class="h-full shadow shadow-gray relative"
                        style="background-color: transparent; padding: 0"
                    >
                        <div
                            class="w-full h-full px-4 p-2 flex flex-wrap transition hover:bg-gray hover:text-white"
                            :class="{
                                'bg-white': r.risk === null,
                                'bg-green': r.risk === 0,
                                'bg-yellow': r.risk === 1,
                                'bg-red text-white': r.risk === 2,
                                'bg-black/80 text-white box': r.risk === 3,
                            }"
                        >
                            <div
                                class="flex text-xs lg:text-[16px] text-ellipsis overflow-hidden"
                            >
                                {{ $t(r.name) }}
                            </div>
                            <div class="w-full grow h-10 lg:h-3"></div>
                            <div
                                class="w-full flex justify-end items-end text-right text-[10px] md:text-[12px] lg:text-lg"
                            >
                                {{
                                    r.risk !== null ? RISK_LEVEL[r.risk] : "n/a"
                                }}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>

        <!-- Symptoms inquiry and Department Reco -->
        <div class="col-span-2 grid grid-cols-3 gap-3 px-3">
            <!-- Inquiry block -->
            <div
                class="h-fit overflow-y-auto flex flex-wrap w-full col-span-3 md:col-span-2"
            >
                <!-- AI DepReco Disclaimer-->
                <Transition>
                    <div
                        class="cursor-pointer hover:bg-gray/30 transition text-[13px] italic bg-gray/10 p-1.5 px-3 mb-2"
                        v-if="show_disclaimer"
                    >
                        <div class="flex">
                            <p class="font-semibold grow">
                                {{ $t("disclaimer") }}
                            </p>
                            <div
                                class="transition text-sm cursor-pointer text-gray/60 hover:text-red"
                                @click="show_disclaimer = false"
                            >
                                &times;
                            </div>
                        </div>

                        <div>
                            {{ $t("disclaimer_content") }}
                        </div>
                    </div>
                </Transition>

                <!-- AI DepReco Input Prompt-->
                <div class="w-full h-full">
                    <!-- Inquiry title -->
                    <div class="w-full p-1 px-2 text-xs font-semibold">
                        {{ $t("inquiry") }}
                    </div>

                    <!-- Symptom insert box -->
                    <div
                        class="w-full bg-gray h-fit -t-lg flex items-center p-1.5"
                        :class="{ '-b-lg': !symptoms.length }"
                    >
                        <img
                            src="../assets/inquiry_symptom.svg"
                            class="w-4 h-4 ml-1"
                        />
                        <input
                            class="placeholder:text-xs bg-transparent grow mx-3 px-2 focus:outline-none text-white text-sm"
                            :placeholder="$t('enter_symptoms_here')"
                            v-model="input_symptom"
                            @input="filterSymptoms"
                            @keyup.enter="handleEnterSymptom"
                        />
                        <div
                            class="cursor-pointer bg-red text-gray font-semibold h-fit p-1 px-2 text-[10px]"
                            @click="insertSymptom"
                        >
                            {{ $t("enter") }}
                        </div>
                    </div>

                    <!-- Suggestions -->
                    <div
                        v-if="filteredSymptoms.length"
                        class="bg-white border border-gray/20 mb-4 overflow-y-auto max-h-[200px]"
                    >
                        <div
                            v-for="(s, index) in filteredSymptoms"
                            :key="index"
                            class="w-full py-1 px-3 text-[14px] cursor-pointer hover:bg-gray/10 transition"
                            :class="{
                                'border-b border-gray/20':
                                    index !== filteredSymptoms.length - 1,
                            }"
                            @click="insertSymptom(s)"
                            @mouseenter="showSymDescription(true, s)"
                            @mouseleave="showSymDescription(false)"
                        >
                            {{ $t(s) }}
                        </div>
                    </div>

                    <!-- Symptoms list-->
                    <Transition>
                        <div
                            class="w-full bg-gray/20 backdrop-blur-lg mt-1"
                            v-if="symptoms.length"
                        >
                            <div
                                class="w-full bg-darkred/70 text-white text-center shadow"
                            >
                                {{ $t("symptoms") }}
                            </div>
                            <div
                                class="max-h-[200px] overflow-y-auto overflow-x-hidden grid grid-cols-1 md:grid-cols-2 p-2 gap-1.5"
                            >
                                <div
                                    v-for="(s, index) in symptoms"
                                    :key="s.id"
                                    class="cursor-pointer transition hover:bg-darkred/30 hover:text-white px-3 py-0.5 text-center text-sm bg-white shadow w-full truncate"
                                    @click="symptoms.splice(index, 1)"
                                    @mouseenter="showSymDescription(true, s)"
                                    @mouseleave="showSymDescription(false)"
                                >
                                    {{ s }}
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- AI DepReco Button -->
                <Transition>
                    <div
                        class="items-center cursor-pointer transition hover:bg-darkred w-full py-1 text-xs mt-2 bg-red text-white flex justify-center"
                        v-if="symptoms.length"
                        @click="submit"
                    >
                        {{ $t("recommend") }}
                        <img
                            src="../assets/recommend.png"
                            class="w-5 h-5 ml-1"
                        /></div
                ></Transition>

                <!-- AI DepReco model Footer -->
                <div class="w-full text-right italic text-[12px] pr-2 mt-2">
                    {{ $t("powered_by_ai_model") }}
                </div>

                <!-- COMMENT: add demonstration here if possible -->
            </div>

            <!-- Reco list -->
            <div
                class="col-span-3 md:col-span-1 h-full min-h-[300px] overflow-y-auto max-h-[600px] w-full p-3 bg-gray/10 text-gray shadow shadow-gray"
                :class="{
                    'h-[280px]': !recommendations.length,
                    'h-full': recommendations.length,
                }"
            >
                <div class="text-xs font-semibold">
                    {{ $t("recommendation") }}
                </div>

                <Transition name="fade">
                    <div v-if="!recommendations.length">
                        <AI_Loader v-if="is_ai_loader_loading" />
                    </div>
                </Transition>
                <Transition name="fade">
                    <div
                        v-if="recommendations.length"
                        class="p-1 mt-1 flex flex-wrap w-full gap-2 text-[14px]"
                    >
                        <div
                            class="transition hover:bg-gray/40 cursor-pointer w-full bg-gray/30 shadow shadow-gray"
                            v-for="(i, index) in recommendations"
                            :key="index"
                            @click="schedule(i)"
                        >
                            <div class="w-full">
                                <div class="bg-red w-fit px-2 text-white">
                                    {{ i.id }}
                                </div>
                            </div>
                            <div class="pb-1 w-full text-center">
                                {{ i.name }}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- Description Displayer -->
        <Transition>
            <div
                v-if="is_description_shown"
                class="description-box absolute text-white right-4 bottom-4 z-30 text-[17px] p-1 px-4 shadow shadow-gray"
            >
                {{ $t(showing_description) }}
            </div>
        </Transition>

        <!-- Postal Modal -->
        <Transition>
            <div v-if="is_postcode_modal_shown" class="">
                <div
                    class="absolute top-0 left-0 z-40 w-full h-full bg-gray/90"
                ></div>
                <div
                    class="text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 w-[400px]"
                >
                    <div class="w-full text-center py-1 bg-gray text-white">
                        {{ $t("necessity_for_hospitalisation") }}
                    </div>
                    <div class="p-2">
                        <div
                            class="py-2 text-center text-white"
                            :class="{
                                'bg-red': necessity_for_hospitalisation,
                                'bg-gray/80': !necessity_for_hospitalisation,
                            }"
                        >
                            {{ necessity_for_hospitalisation ? "YES" : "NO" }}
                        </div>

                        <div class="flex my-4 gap-2 items-center flex-wrap">
                            <p>{{ $t("your_postal_code") }}</p>
                            <input
                                type="number"
                                v-model="postal_code"
                                class="text-[24px] py-1.5 text-center focus:outline-none bg-gray/10 shadow shadow-gray w-full"
                            />
                        </div>
                    </div>
                    <div class="p-2 flex justify-end items-center gap-4">
                        <div
                            class="cursor-pointer transition hover:text-red hover:underline text-center"
                            @click="cancelSubmitPostalCode"
                        >
                            {{ $t("cancel") }}
                        </div>
                        <div
                            class="cursor-pointer transition hover:bg-blue bg-darkgreen text-white shadow shadow-gray w-1/2 text-center py-1"
                            @click="submitPostalCode"
                        >
                            {{ $t("confirm") }}
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition>
            <!-- Add Schedule Modal -->
            <div v-if="is_add_schedule_modal_shown" class="">
                <div
                    class="absolute top-0 left-0 z-50 w-full h-full bg-gray/90"
                ></div>
                <div
                    class="bg-white/90 p-3 flex flex-wrap justify-center items-center text-[14px] absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]"
                >
                    <form class="w-full px-2">
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
                                @click.prevent="handleAddSchedule"
                                type="button"
                            >
                                {{ $t("confirm") }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {},
            RISK_LEVEL: ["LOW", "MODERATE", "HIGH", "VERY HIGH"],
            risk_analysis: [
                {
                    name: "influenza",
                    symptoms: [
                        "fever",
                        "fatigue",
                        "headache",
                        "muscle_aches",
                        "sore_throat",
                    ],
                    risk: null,
                },
                {
                    name: "gastroenteritis",
                    symptoms: [
                        "nausea",
                        "vomiting",
                        "diarrhea",
                        "abdominal_pain",
                    ],
                    risk: null,
                },
                {
                    name: "respiratory_infection",
                    symptoms: ["shortness_of_breath", "cough", "chest_pain"],
                    risk: null,
                },
                {
                    name: "anxiety",
                    symptoms: ["headache", "muscle_aches", "joint_pain"],
                    risk: null,
                },
            ],
            postal_code: null,
            predefined_symptoms: [],
            recommendations: [],
            symptoms: [],
            symptoms_description: [],
            is_ai_loader_loading: true,
            input_symptom: null,
            show_disclaimer: true,
            showing_description: "",
            is_description_shown: false,
            is_postcode_modal_shown: false,
            necessity_for_hospitalisation: null,
            is_add_schedule_modal_shown: false,
            api_url: "http://127.0.0.1:3000",
            added_schedule: { timestamp: null, time: null },
        };
    },

    computed: {
        filteredSymptoms() {
            if (!this.input_symptom || this.input_symptom == "") return [];
            const regex = new RegExp(this.input_symptom, "i");
            return this.predefined_symptoms.filter((symptom) =>
                regex.test(symptom)
            );
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
    },

    methods: {
        insertSymptom(sym = null) {
            if (!this.input_symptom || !sym) return;
            this.showSymDescription(false);

            const targetSym = sym ? sym : this.input_symptom;
            if (!this.symptoms.filter((s) => s === targetSym).length)
                this.symptoms.push(targetSym);
            this.input_symptom = null;
        },
        handleEnterSymptom() {
            this.insertSymptom();
        },
        updateRisk(symptoms) {
            // Iterate through each disease in risk_analysis
            this.risk_analysis.forEach((disease) => {
                // Count the number of matching symptoms
                const matchingSymptoms = symptoms.filter((symptom) =>
                    disease.symptoms.includes(symptom)
                );

                // Calculate the risk score based on the proportion of matching symptoms
                const proportion =
                    matchingSymptoms.length / disease.symptoms.length;

                // Map the proportion to your desired range (0 to 3)
                disease.risk = Math.round(proportion * 3);
            });
        },
        async submit() {
            try {
                const formatted_symptoms = {};
                this.predefined_symptoms.forEach((s) => {
                    formatted_symptoms[s] = this.symptoms.includes(s) ? 1 : 0;
                });

                const symptoms = [...this.symptoms];
                this.updateRisk(symptoms);

                const response = await this.axios.get(
                    this.api_url + "/ai-reco",
                    {
                        params: formatted_symptoms,
                        headers: {
                            Authorization: this.user.passcode,
                        },
                    }
                );

                const need_hospitalisation = response.data.message;

                this.necessity_for_hospitalisation = need_hospitalisation;
                this.is_postcode_modal_shown = true;
            } catch (error) {
                console.error("Error:", error.message);
            }
        },
        async submitPostalCode() {
            this.postal_code = String(this.postal_code);
            this.postal_code =
                "0".repeat(5 - this.postal_code.length) + this.postal_code;

            const response = await this.axios.get(
                this.api_url + "/institutions/" + this.postal_code,
                {
                    headers: {
                        Authorization: this.user.passcode,
                    },
                }
            );

            this.recommendations = response.data.message.filter(
                (i) => i.is_hospital === this.necessity_for_hospitalisation
            );

            this.is_postcode_modal_shown = false;
            this.is_ai_loader_loading = false;
        },
        cancelSubmitPostalCode() {
            this.postal_code = null;
            this.is_postcode_modal_shown = false;
            this.is_ai_loader_loading = false;
        },
        showSymDescription(show, ev) {
            this.is_description_shown = show;
            if (show) {
                this.showing_description =
                    this.symptoms_description[
                        this.predefined_symptoms.indexOf(ev)
                    ];
            } else {
                this.showing_description = null;
            }
        },
        schedule(institution) {
            this.is_add_schedule_modal_shown = true;
            this.selected_institution_id = institution.id;
        },

        closeAddScheduleModal() {
            this.is_add_schedule_modal_shown = false;
        },
        async handleAddSchedule() {
            this.added_schedule.symptoms = this.symptoms.join(";");

            this.added_schedule.timestamp =
                this.added_schedule.timestamp +
                " " +
                this.added_schedule.time +
                ":00";

            this.added_schedule.institution_id = this.selected_institution_id;
            this.added_schedule.patient_id = this.user.id;

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

            console.log(response);

            if (response.data.message)
                this.$swal({
                    title: "Schedule",
                    text: "New schedule apllied successfully.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                });
            else {
                this.$swal({
                    title: "Schedule",
                    text: "New schedule apllied failed.",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }

            this.closeAddScheduleModal();
        },
    },
    async created() {
        this.user.passcode = await sessionStorage.getItem("passcode");
        const user = await JSON.parse(sessionStorage.getItem("user"));
        this.user.id = user.id;
        this.user.role = user.role;
        const response = await this.axios.get(this.api_url + "/symptoms", {
            headers: {
                Authorization: this.user.passcode,
            },
        });

        const symptoms = response.data.message;
        symptoms.forEach((s) => {
            this.predefined_symptoms.push(s.name);
            this.symptoms_description.push(s.description);
        });
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.description-box {
    background: linear-gradient(45deg, #ee674a, #8f66cd);
    background-size: 150% 150%;
    animation: gradientChange 5s infinite;
}

@keyframes gradientChange {
    0% {
        background-position: 0% 50%;
    }
    25% {
        background-position: 100% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    75% {
        background-position: 0% 100%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
