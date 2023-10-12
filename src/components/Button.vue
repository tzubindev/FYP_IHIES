<template>
    <div
        class="text-black transition cursor-pointer w-full rounded-3xl shadow-xl"
        :class="[
            medium ? this.mediumClass : '',
            large ? this.largeClass : '',
            customClass,
        ]"
    >
        {{ title }}
    </div>
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
    },
    data() {
        return {
            mediumClass: "text-sm py-2",
            largeClass: "text-xl py-3",
        };
    },
};
</script>
