<template>
    <VueFinalModal
        class="abs-centre flex justify-center items-center"
        content-class="min-w-[280px] min-h-[280px] flex flex-col max-w-xl mx-4 p-6 bg-gray text-white shadow-xl rounded-lg space-y-2"
        @update:model-value="(val) => emit('update:modelValue', val)"
    >
        <div
            class="flex justify-center items-center p-2 rounded-xl shadow-xl mb-4"
            :class="{
                'bg-green text-gray': modalType == 'info',
                'bg-red text-white': modalType == 'error',
                'bg-yellow text-gray': modalType == 'warning',
            }"
        >
            <h1 class="text-xl font-extrabold">
                {{ title }}
            </h1>
        </div>
        <div class="grow">
            <slot />
        </div>
        <div v-if="!noPresetButton" class="flex justify-end">
            <button
                class="px-3 py-1 mr-2 text-white font-bold hover:underline hover:text-red transition-all rounded-lg"
                @click="cancel"
            >
                Cancel
            </button>
            <button
                class="px-3 py-1 bg-white text-cool font-bold hover:bg-cool hover:text-white transition rounded-lg"
                @click="confirm"
            >
                Confirm
            </button>
        </div>
    </VueFinalModal>
</template>
<style>
.abs-centre {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>

<script>
import { VueFinalModal } from "vue-final-modal";

export default {
    props: {
        title: String,
        modalType: {
            type: String,
            default: "info", // info, error, warning
        },
        noPresetButton: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        VueFinalModal,
    },
    methods: {
        emitEvent(eventName, ...args) {
            this.$emit(eventName, ...args);
        },
        confirm() {
            this.$emit("confirm");
        },
        cancel() {
            this.$emit("cancel");
        },
    },
};
</script>
