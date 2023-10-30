<template>
    <div
        class="bg-gray/5 min-h-screen relative flex justify-center items-center"
    >
        <!-- Small screen size -->
        <div></div>

        <!-- Medium screen size and above-->
        <div class="h-screen w-full flex flex-wrap">
            <!-- Sidebar -->
            <div
                class="bg-gray text-white fixed top-0 bottom-0 lg:left-0 p-3 w-[200px] overflow-y-auto text-center"
            >
                <!-- Company Logo -->
                <div class="text-gray text-xl">
                    <div
                        class="rounded-xl p-4 mt-1 flex flex-wrap justify-center items-center bg-white"
                    >
                        <img src="../assets/app_logo.png" class="h-12 w-12" />
                        <h1 class="w-full font-bold text-gray text-xl mt-2">
                            HEALTHIE
                        </h1>
                    </div>
                    <div class="my-3 bg-white h-[0.5px]"></div>
                </div>

                <!-- Search Box -->
                <div
                    class="p-2 flex justify-center items-center rounded-md px-4 duration-300 cursor-pointer bg-white/40 text-white"
                    @click="openSearchbox"
                    ref="searchInput"
                >
                    <img src="../assets/search.svg" class="w-5 h-5" />
                    <transition name="slide-fade">
                        <input
                            type="text"
                            placeholder="Search"
                            v-if="is_searching"
                            class="cursor-pointer text-sm ml-4 w-full bg-transparent placeholder:text-white focus:outline-none"
                        />
                    </transition>
                </div>

                <!-- Feature Buttons -->
                <div></div>
                <div
                    class="grid grid-cols-1 mt-3 gap-2 bg-white/10 rounded-md p-2"
                >
                    <!-- Dashboard -->
                    <div
                        class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer text-white"
                    >
                        <img src="../assets/dashboard.svg" class="w-5 h-5" />
                        <span class="text-sm ml-4 font-bold">Dashboard</span>
                    </div>

                    <!-- Inquiry -->
                    <div
                        class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer text-white"
                    >
                        <img src="../assets/inquiry.svg" class="w-5 h-5" />
                        <span class="text-sm ml-4 font-bold">Inquiry</span>
                    </div>

                    <!-- Schedule -->
                    <div
                        class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer text-white"
                    >
                        <img src="../assets/schedule.svg" class="w-5 h-5" />
                        <span class="text-sm ml-4 font-bold">Schedule</span>
                    </div>

                    <!-- Setting -->
                    <div
                        class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer text-white"
                    >
                        <img src="../assets/setting.svg" class="w-5 h-5" />
                        <span class="text-sm ml-4 font-bold">Setting</span>
                    </div>
                </div>

                <!-- Logout -->
                <div
                    class="mt-6 hover:bg-red transition p-2 flex justify-start items-center rounded-md px-3 cursor-pointer text-white"
                >
                    <img src="../assets/logout.svg" class="w-5 h-5" />
                    <span class="text-sm ml-4 font-bold">Logout</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // user: {
            //     id: null,
            // },
            errors: [],
            // modalTitle: "Custom Modal",
            // show: false,
            is_searching: false,
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
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
