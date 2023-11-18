<template>
    <div
        class="text-black button transition-all cursor-pointer w-full rounded shadow-md"
        :class="[
            medium ? this.mediumClass : '',
            large ? this.largeClass : '',
            customClass,
        ]"
        v-if="!submit"
        @click="click"
    >
        {{ title }}
    </div>

    <button
        class="text-black button transition-all cursor-pointer w-full rounded shadow-md"
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

<style>
.button {
    transition: background-color 0.3s;
}
</style>

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
        onClick: Function,
    },
    data() {
        return {
            mediumClass: "text-sm py-2",
            largeClass: "text-md py-3",
        };
    },
    methods: {
        click() {
            this.$emit("click");
        },
    },
};
</script>
