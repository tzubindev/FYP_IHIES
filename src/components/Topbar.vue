<template>
    <div
        class="px-3 text-[14px] bg-gray/5 shadow w-full h-10 flex justify-end items-center"
    >
        <!-- Language -->
        <div class="flex items-center mr-3">
            <Dropdown
                class="border-r border-gray/20"
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
                v-if="!is_notification_shown"
                @click="updateNotificationDropdown"
            />

            <img
                src="../assets/notification_opened.svg"
                class="h-5 w-5 cursor-pointer"
                v-if="is_notification_shown"
                @click="updateNotificationDropdown"
            />
        </div>
    </div>
    <Notification
        :items="languages"
        :show="is_notification_shown"
        @selectedItem="updateSelectedNotification"
    ></Notification>
</template>

<style></style>

<script>
export default {
    data() {
        return {
            languages: ["en", "zh_tw", "my", "jp", "kr"],
            is_language_shown: false,
            is_notification_shown: false,
        };
    },
    methods: {
        updateLanguageDropdown() {
            this.is_language_shown = !this.is_language_shown;
            this.is_notification_shown = false;
        },
        updateNotificationDropdown() {
            this.is_notification_shown = !this.is_notification_shown;
            this.is_language_shown = false;
        },
        updateSelectedLanguage(lang) {
            this.$i18n.locale = this.languages.find((l) => l === lang);
        },
    },
};
</script>
