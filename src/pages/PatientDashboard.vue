<template>
    <div
        class="font-serif bg-red/5 min-h-screen relative flex justify-center items-center"
    >
        <div
            v-if="is_access_denied"
            class="flex-wrap access-denied-overlay z-20 absolute w-full h-screen bg-black text-red flex justify-center items-center"
        >
            <p class="access-denied-text font-extrabold">ACCESS DENIED</p>
        </div>

        <Loader
            :loading="!is_verified || !is_initiated"
            class="w-4/5 z-30 absolute"
            v-if="!is_verified || !is_initiated"
        ></Loader>

        <!-- Small screen size -->
        <div></div>

        <!-- Medium screen size and above-->
        <div v-if="is_verified" class="h-screen w-full flex flex-wrap">
            <!-- Sidebar -->
            <Sidebar :username="this.user.name"></Sidebar>

            <!-- Topbar -->
            <div
                class="px-3 text-[14px] bg-gray/5 shadow w-full h-12 flex justify-end items-center"
            >
                <!-- Language -->
                <div class="flex items-center mr-3">
                    <Dropdown
                        class=""
                        :menuItems="languages"
                        :show="is_language_shown"
                        @click="updateLanguageDropdown"
                        @selectedItem="updateSelectedLanguage"
                    >
                        {{ $t(this.$i18n.locale) }}
                    </Dropdown>
                </div>
                <!-- Notification -->
                <div>
                    <img
                        src="../assets/notification_closed.svg"
                        class="h-5 w-5 cursor-pointer"
                        v-if="is_notification_closed"
                        @click="
                            is_notification_closed = !is_notification_closed
                        "
                    />
                    <img
                        src="../assets/notification_opened.svg"
                        class="h-5 w-5 cursor-pointer"
                        v-if="!is_notification_closed"
                        @click="
                            is_notification_closed = !is_notification_closed
                        "
                    />
                </div>
                <!-- Profile
                <div class="flex flex-nowrap items-center ml-2">
                    <div class="h-8 w-8 rounded-lg bg-gray"></div>
                </div> -->
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
            languages: ["en", "cn_tw", "my", "jp", "kr"],
            // modalTitle: "Custom Modal",
            // show: false,
            is_verified: false,
            is_initiated: false,
            is_access_denied: false,
            is_notification_closed: true,
            is_language_shown: false,
            api_url: "http://127.0.0.1:3000",
        };
    },
    async created() {
        console.log("CREATED");
    },
    async mounted() {
        console.log("MOUNTED");

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
                    this.user.name = response.data.message.name;
                    this.is_access_denied = false;
                } else {
                    this.is_initiated = false;
                    this.is_access_denied = true;
                }
            });

        try {
            if (!this.is_access_denied) {
                // Get user preference language
                await this.axios
                    .get(`${this.api_url}/locale/${this.user.id}`)
                    .then((response) => {
                        console.log(response);
                        this.$i18n.locale = response.data.message.locale;
                    });
                this.is_initiated = true;
            }
        } catch (e) {
            console.log(e);
        }
    },
    methods: {
        async initiateDashboard(id) {
            this.$axios();
        },
        updateLanguageDropdown() {
            this.is_language_shown = !this.is_language_shown;
        },
        updateSelectedLanguage(lang) {
            this.$i18n.locale = this.languages.find((l) => l === lang);
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
