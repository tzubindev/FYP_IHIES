<template>
    <VueFinalModal
        class="abs-centre flex justify-center items-center"
        content-class="flex flex-col max-w-xl mx-4 p-4 bg-cool text-white shadow-lg rounded-lg space-y-2"
        @update:model-value="(val) => emit('update:modelValue', val)"
    >
        <h1 class="text-xl">
            {{ title }}
        </h1>
        <slot />
        <button
            class="mt-1 ml-auto px-3 py-1 bg-white text-cool font-bold hover:bg-red hover:text-white transition rounded-lg"
            @click="confirm"
        >
            Confirm
        </button>
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
    },
};
</script>
