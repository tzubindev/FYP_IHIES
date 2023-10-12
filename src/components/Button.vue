<template>
    <div
        class="text-black transition cursor-pointer w-full rounded-3xl shadow-xl"
        :class="[
            medium ? this.mediumClass : '',
            large ? this.largeClass : '',
            customClass,
        ]"
        v-if="!submit"
    >
        {{ title }}
    </div>

    <button
        class="text-black transition cursor-pointer w-full rounded-3xl shadow-xl"
        :class="[
            medium ? this.mediumClass : '',
            large ? this.largeClass : '',
            customClass,
        ]"
        v-if="submit"
        type="submit"
        value="Submit"
    >
        {{ title }}
    </button>
</template>

<script>
export default {
    props: {
        title: String,
        small: {
            type: Boolean,
            default: false,
        },
        medium: {
            type: Boolean,
            default: false,
        },
        large: {
            type: Boolean,
            default: false,
        },
        customClass: String,
        submit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            mediumClass: "text-sm py-2",
            largeClass: "text-xl py-3",
        };
    },
};
</script>
