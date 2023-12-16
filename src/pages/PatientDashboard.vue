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
                @toggled="updateSidebarExpansion"
            ></Sidebar>

            <!-- Topbar -->
            <Topbar></Topbar>

            <!-- Dashboard -->
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
                            <p>{{ $t("dashboard") }}</p>
                        </div>
                    </div>

                    <!-- Medium size -->
                    <div class="block lg:hidden">
                        <!-- Profile -->
                        <div
                            class="py-4 w-full flex flex-wrap h-fit bg-gray text-white items-center"
                        >
                            <!-- Picture -->
                            <div
                                class="h-full w-1/2 justify-center items-center"
                            >
                                <img
                                    src="../sample_assets/profilePic_tb.jpg"
                                    class="w-[120px] h-[120px] mx-auto"
                                />
                            </div>

                            <!-- Name and Access -->
                            <div
                                class="h-full w-1/2 flex flex-wrap items-center justify-end pr-4"
                            >
                                <div class="font-extrabold text-xl w-full">
                                    {{ $t("user") }}
                                </div>
                                <div class="text-md w-full">
                                    {{ this.user.name }}
                                </div>
                                <div
                                    class="p-2 py-1.5 mt-4 text-xs bg-white/20 cursor-pointer transition hover:bg-white hover:text-gray"
                                >
                                    {{ $t("view_profile") }}
                                </div>
                            </div>

                            <!-- Profile details -->
                            <div
                                class="h-full w-full p-4 gap-1 grid grid-cols-2 text-[12px] border-l border-white/20"
                            >
                                <!-- Sex -->
                                <div class="flex flex-wrap">
                                    <!-- label -->
                                    <div class="font-light w-full">
                                        {{ $t("sex") }}
                                    </div>
                                    <!-- data -->
                                    <div
                                        class="w-full text-center py-0.5 font-extrabold"
                                        v-if="profile.sex"
                                    >
                                        {{ $t(profile.sex) }}
                                    </div>
                                    <Barloader v-if="!profile.sex" />
                                </div>
                                <!-- Age -->
                                <div class="flex flex-wrap">
                                    <div class="font-light w-full">
                                        {{ $t("age") }}
                                    </div>
                                    <div
                                        class="w-full text-center py-0.5 font-extrabold"
                                        v-if="profile.sex"
                                    >
                                        {{ profile.age }}
                                    </div>
                                    <Barloader v-if="!profile.age" />
                                </div>
                                <div>
                                    <!-- blood -->
                                    <div class="flex flex-wrap">
                                        <div class="font-light w-full">
                                            {{ $t("blood") }}
                                        </div>
                                        <div
                                            class="w-full text-center py-0.5 font-extrabold"
                                            v-if="profile.blood"
                                        >
                                            {{ profile.blood }}
                                        </div>
                                        <Barloader v-if="!profile.blood" />
                                    </div>
                                </div>

                                <!-- height -->
                                <div class="flex flex-wrap">
                                    <div class="font-light w-full">
                                        {{ $t("height") }}
                                    </div>
                                    <div
                                        class="w-full text-center py-0.5 font-extrabold"
                                        v-if="profile.height"
                                    >
                                        {{ profile.height }} m
                                    </div>
                                    <Barloader v-if="!profile.height" />
                                </div>

                                <!-- weight -->
                                <div class="flex flex-wrap">
                                    <div class="font-light w-full">
                                        {{ $t("weight") }}
                                    </div>
                                    <div
                                        class="w-full text-center py-0.5 font-extrabold"
                                        v-if="profile.weight"
                                    >
                                        {{ profile.weight }} kg
                                    </div>
                                    <Barloader v-if="!profile.weight" />
                                </div>

                                <!--last logged in  -->
                                <div class="flex flex-wrap">
                                    <div class="font-light w-full">
                                        {{ $t("last_logged_in") }}
                                    </div>
                                    <div
                                        class="w-full text-center py-0.5 font-extrabold"
                                        v-if="profile.last"
                                    >
                                        {{ profile.last }}
                                    </div>
                                    <Barloader v-if="!profile.last" />
                                </div>
                            </div>
                        </div>

                        <!-- Statistics -->
                        <div class="w-full h-full py-3">
                            <div
                                class="w-full h-full border-y border-gray/20 pb-3 text-[14px]"
                            >
                                <div class="w-full my-1.5">
                                    {{ $t("personal_data") }}
                                </div>

                                <div
                                    class="w-full h-5/6 grid grid-cols-1 gap-6"
                                >
                                    <!-- SYS -->
                                    <div
                                        class="cursor-pointer bg-gray text-white p-4 pt-2 pb-0 w-full h-44"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("sys") }}
                                                </p>

                                                <img
                                                    src="../assets/heart.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_sys.datasets[0]
                                                            .data[
                                                            data_sys.datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-white/60 italic"
                                                >
                                                    {{ $t("mmHg") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_sys"
                                                :options="options_sys"
                                            />
                                        </div>
                                    </div>

                                    <!-- DIA -->
                                    <div
                                        class="cursor-pointer text-gray border-2 border-gray/40 p-4 pt-2 pb-0 w-full h-44"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("dia") }}
                                                </p>

                                                <img
                                                    src="../assets/heart.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_dia.datasets[0]
                                                            .data[
                                                            data_dia.datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-gray/60 italic"
                                                >
                                                    {{ $t("mmHg") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_dia"
                                                :options="options_dia"
                                            />
                                        </div>
                                    </div>

                                    <!-- Pulse -->
                                    <div
                                        class="cursor-pointer text-gray border-2 border-gray/40 p-4 pt-2 pb-0 w-full h-44"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("pulse") }}
                                                </p>

                                                <img
                                                    src="../assets/pulse.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_pulse.datasets[0]
                                                            .data[
                                                            data_pulse
                                                                .datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-gray/60 italic"
                                                >
                                                    {{ $t("bpm") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_pulse"
                                                :options="options_pulse"
                                            />
                                        </div>
                                    </div>

                                    <!-- Breath -->
                                    <div
                                        class="cursor-pointer text-gray border-2 border-gray/40 p-4 pt-2 pb-0 w-full h-44"
                                    >
                                        <div class="h-1/2 flex">
                                            <div
                                                class="w-fit flex h-fit items-center"
                                            >
                                                <p class="text-sm">
                                                    {{ $t("breath") }}
                                                </p>

                                                <img
                                                    src="../assets/breath.svg"
                                                    class="h-5 w-5 mx-1.5"
                                                />
                                            </div>
                                            <div
                                                class="flex grow justify-center items-center"
                                            >
                                                <div
                                                    class="h-fit text-[68px] mr-1.5"
                                                >
                                                    {{
                                                        data_breath.datasets[0]
                                                            .data[
                                                            data_breath
                                                                .datasets[0]
                                                                .data.length - 1
                                                        ]
                                                    }}
                                                </div>
                                                <div
                                                    class="text-gray/60 italic"
                                                >
                                                    {{ $t("tpm") }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="h-1/2">
                                            <Line
                                                :data="data_breath"
                                                :options="options_breath"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- large size screen -->
                    <div
                        class="hidden lg:flex justify-center flex-wrap lg:pb-4"
                    >
                        <div class="lg:grid grid-cols-2 gap-4 max-w-[1140px]">
                            <!-- Profile -->
                            <div
                                class="shadow-lg shadow-gray/30 p-4 w-full flex h-full flex-wrap bg-gray text-white items-center"
                            >
                                <div class="w-full grid grid-cols-2 h-2/5">
                                    <!-- Picture -->
                                    <div
                                        class="h-full w-full flex justify-center items-center"
                                    >
                                        <img
                                            src="../sample_assets/profilePic_tb.jpg"
                                            class="w-[150px] h-[150px] -full"
                                        />
                                    </div>

                                    <!-- Name and Access -->
                                    <div
                                        class="h-full w-full flex items-center px-4"
                                    >
                                        <div>
                                            <div class="font-extrabold text-xl">
                                                {{ $t("user") }}
                                            </div>
                                            <div class="text-md">
                                                {{ this.user.name }}
                                            </div>
                                            <div
                                                class="p-3 py-1.5 mt-4 text-xs w-fit bg-white/20 cursor-pointer transition hover:bg-white hover:text-gray"
                                            >
                                                {{ $t("view_profile") }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Profile details -->
                                <div
                                    class="h-3/5 w-full p-4 py-2 gap-4 grid grid-cols-1 text-[12px]"
                                >
                                    <!-- Sex -->
                                    <div
                                        class="grid grid-cols-4 cursor-pointer"
                                    >
                                        <!-- label -->
                                        <div
                                            class="font-light w-fit pl-0 hover:pl-4 transition-all"
                                        >
                                            {{ $t("sex") }}
                                        </div>
                                        <!-- data -->
                                        <!-- <div
                                    class="w-full text-center py-0.5  font-extrabold"
                                >
                                    {{ $t("sex") }}
                                </div> -->
                                        <Barloader class="w-full col-span-3" />
                                    </div>

                                    <!-- Age -->
                                    <div
                                        class="grid grid-cols-4 cursor-pointer"
                                    >
                                        <div
                                            class="font-light w-fit pl-0 hover:pl-4 transition-all"
                                        >
                                            {{ $t("age") }}
                                        </div>
                                        <!-- <div
                                    class="w-full text-center py-0.5  font-extrabold"
                                >
                                    {{ $t("age") }}
                                </div> -->
                                        <Barloader class="w-full col-span-3" />
                                    </div>

                                    <!-- blood -->
                                    <div
                                        class="grid grid-cols-4 cursor-pointer"
                                    >
                                        <div
                                            class="font-light w-fit pl-0 hover:pl-4 transition-all"
                                        >
                                            {{ $t("blood") }}
                                        </div>
                                        <!-- <div
                                        class="w-full text-center py-0.5  font-extrabold"
                                    >
                                        {{ $t("blood") }}
                                    </div> -->
                                        <Barloader class="w-full col-span-3" />
                                    </div>

                                    <!-- height -->
                                    <div
                                        class="grid grid-cols-4 cursor-pointer"
                                    >
                                        <div
                                            class="font-light w-fit pl-0 hover:pl-4 transition-all"
                                        >
                                            {{ $t("height") }}
                                        </div>
                                        <!-- <div
                                    class="w-full text-center py-0.5  font-extrabold"
                                >
                                    {{ $t("height") }}
                                </div> -->
                                        <Barloader class="w-full col-span-3" />
                                    </div>

                                    <!-- weight -->
                                    <div
                                        class="grid grid-cols-4 cursor-pointer"
                                    >
                                        <div
                                            class="font-light w-fit pl-0 hover:pl-4 transition-all"
                                        >
                                            {{ $t("weight") }}
                                        </div>
                                        <!-- <div
                                    class="w-full text-center py-0.5  font-extrabold"
                                >
                                    {{ $t("weight") }}
                                </div> -->
                                        <Barloader class="w-full col-span-3" />
                                    </div>

                                    <!--last logged in  -->
                                    <div
                                        class="grid grid-cols-4 cursor-pointer"
                                    >
                                        <div
                                            class="font-light w-fit pl-0 hover:pl-4 transition-all"
                                        >
                                            {{ $t("last_logged_in") }}
                                        </div>
                                        <!-- <div
                                    class="w-full text-center py-0.5  font-extrabold"
                                >
                                    {{ $t("last_logged_in") }}
                                </div> -->
                                        <Barloader class="w-full col-span-3" />
                                    </div>
                                </div>
                            </div>

                            <!-- Statistics -->
                            <div
                                class="w-full h-full max-h-[600px] pl-4 pr-0 border-l-2 border-gray/20"
                            >
                                <div class="w-full text-[14px]">
                                    <div
                                        class="w-fit flex items-center pt-2 mb-3 border-b border-gray/40"
                                    >
                                        {{ $t("personal_data") }}
                                    </div>

                                    <div
                                        class="w-full h-full flex flex-wrap gap-3"
                                    >
                                        <!-- SYS -->
                                        <div
                                            class="shadow-lg shadow-gray/30 flex cursor-pointer bg-gray text-white p-2 py-2 w-full h-[115px]"
                                        >
                                            <!-- summary -->
                                            <div
                                                class="h-fit w-1/3 flex flex-wrap"
                                            >
                                                <div
                                                    class="w-full flex h-fit items-center"
                                                >
                                                    <p class="text-[12px]">
                                                        {{ $t("sys") }}
                                                    </p>

                                                    <img
                                                        src="../assets/heart.svg"
                                                        class="h-5 w-5 mx-1.5"
                                                    />
                                                </div>
                                                <div
                                                    class="flex grow justify-center items-center mt-2"
                                                >
                                                    <div
                                                        class="h-fit text-[40px] mr-1.5"
                                                    >
                                                        {{
                                                            data_sys.datasets[0]
                                                                .data[
                                                                data_sys
                                                                    .datasets[0]
                                                                    .data
                                                                    .length - 1
                                                            ]
                                                        }}
                                                    </div>
                                                    <div
                                                        class="text-white/60 h-full italic flex items-end text-[10px] pb-2"
                                                    >
                                                        {{ $t("mmHg") }}
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- chart -->
                                            <div class="w-2/3">
                                                <Line
                                                    :data="data_sys"
                                                    :options="options_sys"
                                                />
                                            </div>
                                        </div>

                                        <!-- DIA -->
                                        <div
                                            class="shadow-lg shadow-gray/30 flex cursor-pointer text-gray border-2 border-gray/40 p-2 py-2 w-full h-[115px]"
                                        >
                                            <div
                                                class="h-fit w-1/3 flex flex-wrap"
                                            >
                                                <div
                                                    class="w-full flex h-fit items-center"
                                                >
                                                    <p class="text-[12px]">
                                                        {{ $t("dia") }}
                                                    </p>

                                                    <img
                                                        src="../assets/heart.svg"
                                                        class="h-5 w-5 mx-1.5"
                                                    />
                                                </div>
                                                <div
                                                    class="flex grow justify-center items-center mt-2"
                                                >
                                                    <div
                                                        class="h-fit text-[40px] mr-1.5"
                                                    >
                                                        {{
                                                            data_dia.datasets[0]
                                                                .data[
                                                                data_dia
                                                                    .datasets[0]
                                                                    .data
                                                                    .length - 1
                                                            ]
                                                        }}
                                                    </div>
                                                    <div
                                                        class="text-gray/60 h-full italic flex items-end text-[10px] pb-2"
                                                    >
                                                        {{ $t("mmHg") }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="w-2/3">
                                                <Line
                                                    :data="data_dia"
                                                    :options="options_dia"
                                                />
                                            </div>
                                        </div>

                                        <!-- Pulse -->
                                        <div
                                            class="shadow-lg shadow-gray/30 flex cursor-pointer text-gray border-2 border-gray/40 p-2 py-2 w-full h-[115px]"
                                        >
                                            <div
                                                class="h-fit w-1/3 flex flex-wrap"
                                            >
                                                <div
                                                    class="w-full flex h-fit items-center"
                                                >
                                                    <p class="text-[12px]">
                                                        {{ $t("pulse") }}
                                                    </p>

                                                    <img
                                                        src="../assets/pulse.svg"
                                                        class="h-5 w-5 mx-1.5"
                                                    />
                                                </div>
                                                <div
                                                    class="flex grow justify-center items-center mt-2"
                                                >
                                                    <div
                                                        class="h-fit text-[40px] mr-1.5"
                                                    >
                                                        {{
                                                            data_pulse
                                                                .datasets[0]
                                                                .data[
                                                                data_pulse
                                                                    .datasets[0]
                                                                    .data
                                                                    .length - 1
                                                            ]
                                                        }}
                                                    </div>
                                                    <div
                                                        class="text-gray/60 h-full italic flex items-end text-[10px] pb-2"
                                                    >
                                                        {{ $t("bpm") }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="w-2/3">
                                                <Line
                                                    :data="data_pulse"
                                                    :options="options_pulse"
                                                />
                                            </div>
                                        </div>

                                        <!-- Breath -->
                                        <div
                                            class="shadow-lg shadow-gray/30 flex cursor-pointer text-gray border-2 border-gray/40 p-2 py-2 w-full h-[115px]"
                                        >
                                            <div
                                                class="h-fit w-1/3 flex flex-wrap"
                                            >
                                                <div
                                                    class="w-full flex h-fit items-center"
                                                >
                                                    <p class="text-[12px]">
                                                        {{ $t("breath") }}
                                                    </p>

                                                    <img
                                                        src="../assets/breath.svg"
                                                        class="h-5 w-5 mx-1.5"
                                                    />
                                                </div>
                                                <div
                                                    class="flex grow justify-center items-center mt-2"
                                                >
                                                    <div
                                                        class="h-fit text-[40px] mr-1.5"
                                                    >
                                                        {{
                                                            data_breath
                                                                .datasets[0]
                                                                .data[
                                                                data_breath
                                                                    .datasets[0]
                                                                    .data
                                                                    .length - 1
                                                            ]
                                                        }}
                                                    </div>
                                                    <div
                                                        class="text-gray/60 h-full italic flex items-end text-[10px] pb-2"
                                                    >
                                                        {{ $t("tpm") }}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="w-2/3">
                                                <Line
                                                    :data="data_breath"
                                                    :options="options_breath"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Path to view medical record -->
                    <div class="w-full h-32 flex justify-center">
                        <div
                            class="cursor-pointer transition hover:shadow w-full max-w-[1140px] mb-4 shadow-gray/40 shadow-xl overflow-hidden relative"
                            @click="this.leadTo('medical-record')"
                        >
                            <img
                                src="../assets/medical_record.jpg"
                                class="h-full w-full object-cover"
                                alt="Medical Record"
                            />
                            <div
                                class="absolute inset-0 bg-gray opacity-70"
                            ></div>
                            <div
                                class="hover:bg-gray/40 text-white absolute inset-0 flex justify-center items-center font-extrabold text-3xl"
                            >
                                {{ $t("view_your_medical_record") }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

ChartJS.defaults.plugins.legend.display = false;

export default {
    components: {
        Line,
    },
    data() {
        return {
            user: {
                id: null,
                name: null,
                passcode: null,
            },
            profile: {
                sex: "something",
                age: null,
                blood: null,
                height: null,
                weight: 52,
                last: null,
            },

            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            is_sidebar_expanding: false,
            api_url: "http://127.0.0.1:3000",

            // Chart
            // SYS
            data_sys: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [99, 110, 106],
                    },
                ],
            },
            options_sys: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(255,255,255,0.5)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(255,255,255,0.5)",
                        },
                    },
                },
            },
            // DIA
            data_dia: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [140, 110, 96],
                    },
                ],
            },
            options_dia: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                },
            },
            // pulse
            data_pulse: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [72, 84, 80],
                    },
                ],
            },
            options_pulse: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                },
            },

            // breath
            data_breath: {
                labels: ["", "", ""],
                datasets: [
                    {
                        borderColor: "#fb5b25",
                        data: [16, 18, 24],
                    },
                ],
            },
            options_breath: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                    y: {
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                    },
                },
            },
        };
    },
    async created() {
        console.log("CREATED");
    },
    async mounted() {
        console.log("MOUNTED");

        this.user.passcode = await sessionStorage.getItem("passcode");

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
    },

    methods: {
        async initiateDashboard(id) {
            this.$axios();
        },
        updateSidebarExpansion(e) {
            this.is_sidebar_expanding = e;
        },
        leadTo(des) {
            this.$router.push(`/${des}/${this.$route.params.id}`);
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
