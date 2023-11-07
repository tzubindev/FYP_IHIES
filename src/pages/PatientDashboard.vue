<template>
    <div
        class="bg-gray/5 min-h-screen relative flex justify-center items-center"
    >
        <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-20 absolute w-full h-screen bg-black text-red flex justify-center items-center"
        >
            <p class="access-denied-text font-extrabold">ACCESS DENIED</p>
        </div>

        <Loader
            :loading="!is_verified && !is_initiated"
            class="w-4/5 z-30"
            v-if="!is_verified && !is_initiated"
        ></Loader>

        <!-- Small screen size -->
        <div></div>

        <!-- Medium screen size and above-->
        <div v-if="is_verified" class="h-screen w-full flex flex-wrap">
            <!-- Sidebar -->
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
                        <p class="text-sm w-full">Good Morning</p>

                        <p class="text-sm w-full font-bold">
                            {{ this.user.name }}
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
                            <img
                                src="../assets/dashboard.svg"
                                class="w-4 h-4"
                            />
                            <span class="text-[13px] ml-3 font-bold"
                                >Dashboard</span
                            >
                        </div>

                        <!-- Inquiry -->
                        <div
                            class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                        >
                            <img src="../assets/inquiry.svg" class="w-4 h-4" />
                            <span class="text-[13px] ml-3 font-bold"
                                >Inquiry</span
                            >
                        </div>

                        <!-- Schedule -->
                        <div
                            class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                        >
                            <img src="../assets/schedule.svg" class="w-4 h-4" />
                            <span class="text-[13px] ml-3 font-bold"
                                >Schedule</span
                            >
                        </div>

                        <!-- Setting -->
                        <div
                            class="hover:bg-black transition p-2 flex items-center rounded-md px-3 cursor-pointer"
                        >
                            <img src="../assets/setting.svg" class="w-4 h-4" />
                            <span class="text-[13px] ml-3 font-bold"
                                >Setting</span
                            >
                        </div>
                    </div>

                    <!-- Logout -->
                    <div
                        class="mt-3 bg-red hover:bg-red/40 transition p-2 px-3 flex justify-start items-center rounded-md cursor-pointer"
                    >
                        <img src="../assets/logout.svg" class="w-4 h-4" />
                        <span class="text-[14px] ml-3 font-bold">Logout</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                id: null,
                name: null,
                passcode: null,
            },
            errors: [],
            // modalTitle: "Custom Modal",
            // show: false,
            is_searching: false,
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            api_url: "http://127.0.0.1:3000",
        };
    },
    async created() {
        console.log(this.$route.query);
        if (!this.$route.query.hasOwnProperty("passcode"))
            this.is_access_denied = true;

        this.user.id = this.$route.params.id;
        if (!this.user.passcode)
            this.user.passcode = this.$route.query.passcode;

        await this.axios
            .post(`${this.api_url}/username`, this.user)
            .then((response) => {
                console.log("start verification");

                this.is_verified = true;
                if (response.data.message.passcode_verification) {
                    this.is_initiated = true;
                    this.user.name = response.data.message.name;
                    this.is_access_denied = false;
                } else {
                    this.is_initiated = false;
                    this.is_access_denied = true;
                }
            });
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
        async initiateDashboard(id) {
            this.$axios();
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
