<template>
    <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
    components: {
        Doughnut,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        },
    },
    computed: {
        chartData() {
            return this.data;
        },
        chartOptions() {
            return this.options;
        },
    },
};
</script>
