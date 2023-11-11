<template>
    <div
        class="bg-gray text-white fixed top-0 bottom-0 lg:left-0 w-[180px] lg:w-[240px] text-center"
    >
        <!-- Company Logo -->
        <div
            class="p-4 pt-0 flex flex-wrap justify-start items-center text-gray text-xl h-[200px] bg-white"
        >
            <h1 class="z-10 w-full font-extrabold text-gray text-sm">
                HEALTHIE
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
                class="absolute -left-[60px] top-[60px] w-[200px] h-[140px] lg:w-[240px] bg-orange rounded-t-full"
            ></div>

            <div
                class="absolute left-[40px] top-[60px] w-[140px] h-[140px] lg:w-[180px] lg:left-[60px] bg-red rounded-tl-full"
            ></div>

            <div
                class="absolute left-[110px] top-[130px] w-[70px] h-[70px] lg:w-[100px] lg:left-[140px] bg-gradient-to-br from-red to-white/40 rounded-tl-full"
            ></div>
        </div>

        <!-- Side bar bottom part -->
        <div class="z-10 p-2 pt-0 mt-3">
            <!-- Search Box -->
            <div
                class="hover:bg-black/40 p-1 flex justify-center items-center rounded-md px-4 duration-300 cursor-pointer bg-white/40"
                @click="openSearchbox"
                ref="searchInput"
            >
                <img src="../assets/search.svg" class="w-6 h-6" />
                <transition name="slide-fade">
                    <input
                        type="text"
                        placeholder="Search"
                        v-if="is_searching"
                        class="cursor-pointer text-[14px] ml-4 w-full bg-transparent placeholder:text-white focus:outline-none"
                    />
                </transition>
            </div>

            <!-- Feature Buttons -->
            <div
                class="grid grid-cols-1 mt-3 gap-1 bg-white/10 shadow-xl rounded-md p-1"
            >
                <!-- Dashboard -->
                <div
                    class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                >
                    <img src="../assets/dashboard.svg" class="w-4 h-4" />
                    <span class="text-[13px] ml-3 font-bold">{{
                        $t("dashboard")
                    }}</span>
                </div>

                <!-- Inquiry -->
                <div
                    class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                >
                    <img src="../assets/inquiry.svg" class="w-4 h-4" />
                    <span class="text-[13px] ml-3 font-bold">{{
                        $t("inquiry")
                    }}</span>
                </div>

                <!-- Schedule -->
                <div
                    class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                >
                    <img src="../assets/schedule.svg" class="w-4 h-4" />
                    <span class="text-[13px] ml-3 font-bold">{{
                        $t("schedule")
                    }}</span>
                </div>

                <!-- Setting -->
                <div
                    class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                >
                    <img src="../assets/setting.svg" class="w-4 h-4" />
                    <span class="text-[13px] ml-3 font-bold">{{
                        $t("setting")
                    }}</span>
                </div>
            </div>

            <!-- Logout -->
            <div
                class="mt-3 bg-red hover:bg-red/40 transition p-2 px-3 flex justify-start items-center rounded-md cursor-pointer"
            >
                <img src="../assets/logout.svg" class="w-4 h-4" />
                <span class="text-[14px] ml-3 font-bold">{{
                    $t("logout")
                }}</span>
            </div>
        </div>
    </div>
</template>

<style></style>

<script>
export default {
    props: {
        username: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            is_searching: false,
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
    },
};
</script>
