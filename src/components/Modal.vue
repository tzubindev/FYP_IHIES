<template>
    <div
        class="w-full h-full absolute top-0 left-0 bg-gray/80 backdrop-blur-lg z-40"
    ></div>

    <div
        class="z-50 abs-centre bg-gray p-8 py-4 w-fit max-w-[90%] text-white shadow shadow-white/40"
    >
        <div class="w-full flex justify-center mb-10">
            <h1
                class="text-md font-extrabold p-1 px-4 w-fit"
                :class="{
                    'bg-green text-gray': modalType == 'info',
                    'bg-red text-white': modalType == 'error',
                    'bg-yellow text-gray': modalType == 'warning',
                }"
            >
                {{ $t(title) }}
            </h1>
        </div>
        <slot />

        <div class="flex justify-end">
            <button
                class="px-3 py-1 mr-2 text-white font-bold hover:underline hover:text-red transition-all"
                v-if="!noCancelButton"
                @click="cancel"
            >
                {{ $t("cancel") }}
            </button>
            <button
                class="px-3 py-1 bg-white text-cool font-bold hover:bg-cool hover:text-white transition"
                @click="confirm"
            >
                {{ $t("confirm") }}
            </button>
        </div>
    </div>
</template>

<style>
.abs-centre {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

body {
    padding-right: 0px;
}
</style>

<script>
export default {
    emits: ["confirm", "cancel"],
    props: {
        title: String,
        modalType: {
            type: String,
            default: "info", // info, error, warning
        },
        noCancelButton: {
            type: Boolean,
            default: false,
        },
    },
    components: {},
    methods: {
        confirm() {
            this.$emit("confirm");
        },
        cancel() {
            this.$emit("cancel");
        },
    },
};
</script>
