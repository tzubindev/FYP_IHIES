<template>
    <div
        class="px-3 text-[14px] bg-gray/5 shadow w-full h-12 flex justify-end items-center"
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
                v-if="is_notification_closed"
                @click="is_notification_closed = !is_notification_closed"
            />
            <img
                src="../assets/notification_opened.svg"
                class="h-5 w-5 cursor-pointer"
                v-if="!is_notification_closed"
                @click="is_notification_closed = !is_notification_closed"
            />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            languages: ["en", "zh_tw", "my", "jp", "kr"],
            is_language_shown: false,
            is_notification_closed: true,
        };
    },
    methods: {
        updateLanguageDropdown() {
            this.is_language_shown = !this.is_language_shown;
        },
        updateSelectedLanguage(lang) {
            this.$i18n.locale = this.languages.find((l) => l === lang);
        },
    },
};
</script>
