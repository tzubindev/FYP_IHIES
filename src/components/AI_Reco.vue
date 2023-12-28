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
                        class="h-full shadow-xl relative"
                        style="background-color: transparent; padding: 0"
                    >
                        <div
                            class="w-full h-full px-4 p-2 flex flex-wrap transition hover:bg-gray hover:text-white"
                            :class="{
                                'bg-green  ': r.risk === 0,
                                'bg-yellow': r.risk === 1,
                                'bg-red text-white': r.risk === 2,
                                'bg-black/80 text-white ': r.risk === 3,
                                'box ': r.risk === 3,
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
                                {{ RISK_LEVEL[r.risk] }}
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
                            @keyup.enter="handleEnterSymptom"
                        />
                        <div
                            class="cursor-pointer bg-red text-gray font-semibold h-fit p-1 px-2 text-[10px]"
                            @click="insert_symptom"
                        >
                            {{ $t("enter") }}
                        </div>
                    </div>

                    <!-- Symptoms list-->
                    <Transition>
                        <div
                            class="overflow-y-auto overflow-x-hidden grid grid-cols-1 md:grid-cols-2 gap-1.5 p-2 w-full bg-gray/20 max-h-[200px] -b-lg backdrop-blur-lg"
                            v-if="symptoms.length"
                        >
                            <div
                                v-for="(s, index) in symptoms"
                                :key="s.id"
                                class="cursor-pointer transition hover:bg-gray hover:text-white px-3 py-0.5 text-center text-sm bg-white shadow w-full truncate"
                                @click="symptoms.splice(index, 1)"
                            >
                                {{ s }}
                            </div>
                        </div>
                    </Transition>
                </div>

                <!-- AI DepReco Button -->
                <Transition>
                    <div
                        class="items-center cursor-pointer transition hover:bg-red/80 hover:text-gray w-full py-1 text-xs mt-2 bg-red text-white flex justify-center"
                        v-if="symptoms.length"
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
                class="col-span-3 md:col-span-1 min-h-[280px] max-h-[500px] w-full p-3 bg-gray/20 backdrop-blur-xl text-gray shadow-lg"
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
                        <AI_Loader />
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // Risk Analysis
    // https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10355013/
    data() {
        return {
            RISK_LEVEL: ["LOW", "MODERATE", "HIGH", "VERY HIGH"],
            risk_analysis: [
                {
                    name: "ischaemic_heart_disease",
                    risk: 0,
                },
                {
                    name: "lower_respiratory_infections",
                    risk: 1,
                },
                {
                    name: "cerebrovascular_disease",
                    risk: 2,
                },
                {
                    name: "diabetes_mellitus",
                    risk: 3,
                },
            ],
            recommendations: [],
            symptoms: [],
            input_symptom: null,
            show_disclaimer: true,
        };
    },

    methods: {
        insert_symptom() {
            console.log(this.input_symptom);
            if (!this.input_symptom) return;
            if (!this.symptoms.filter((s) => s === this.input_symptom).length)
                this.symptoms.push(this.input_symptom);
            this.input_symptom = null;
        },
        handleEnterSymptom() {
            this.insert_symptom();
        },
    },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
