<template>
    <!-- TRANSLATION -->
    <div class="max-w-[1000px] w-full mx-auto grid grid-cols-2 gap-4">
        <!-- Risk Analysis -->
        <div class="w-full h-fit p-1 px-3 flex col-span-2 flex-wrap">
            <!-- Title -->
            <div class="text-xs font-semibold p-2">Risk Analysis</div>

            <!-- Analysis Cards -->
            <div class="grid grid-cols-4 gap-2 w-full">
                <div v-for="(r, index) in risk_analysis" :key="index">
                    <Card
                        class="h-full shadow-xl relative"
                        style="background-color: transparent; padding: 0"
                    >
                        <div
                            class="w-full h-full px-4 p-2 flex flex-wrap rounded"
                            :class="{
                                'bg-green': r.risk === 0,
                                'bg-yellow': r.risk === 1,
                                'bg-red text-white': r.risk === 2,
                                'bg-black/80 text-white ': r.risk === 3,
                                'box ': r.risk === 3,
                            }"
                        >
                            <div
                                class="flex text-xs lg:text-sm text-ellipsis overflow-hidden"
                            >
                                {{ r.name }}
                            </div>
                            <div class="w-full grow"></div>
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
            <!--  -->
            <div
                class="h-fit overflow-y-auto flex flex-wrap w-full col-span-3 md:col-span-2"
            >
                <div class="w-full h-full">
                    <div class="w-full p-1 px-2 text-xs font-semibold">
                        {{ $t("inquiry") }}
                    </div>
                    <div
                        class="w-full bg-gray h-12 rounded-lg flex items-center px-3 p-2"
                    >
                        <img
                            src="../assets/inquiry_symptom.svg"
                            class="w-5 h-5"
                        />
                        <input
                            class="bg-transparent grow mx-3 px-2 focus:outline-none text-white text-sm"
                            placeholder="Enter Symptoms Here"
                        />
                        <div
                            class="bg-red text-gray font-semibold h-fit p-1 px-2 text-[10px] rounded"
                        >
                            Enter
                        </div>
                    </div>
                </div>
                <div class="w-full text-right italic text-[12px] pr-2 mt-2">
                    Powered by AI model
                </div>
            </div>

            <!-- Reco list -->
            <div
                class="col-span-3 md:col-span-1 min-h-[280px] max-h-[500px] w-full p-3 bg-gray/20 backdrop-blur-xl text-gray shadow-lg rounded-lg"
                :class="{
                    'h-[280px]': !recommendations.length,
                    'h-full': recommendations.length,
                }"
            >
                <div class="text-xs font-semibold">Recommendation</div>

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
                    name: "Ischaemic Heart Disease",
                    risk: 0,
                },
                {
                    name: "Lower Respiratory Infections",
                    risk: 1,
                },
                {
                    name: "Cerebrovascular Disease",
                    risk: 2,
                },
                {
                    name: "Diabetes Mellitus",
                    risk: 3,
                },
            ],
            recommendations: [],
        };
    },

    methods: {},
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
