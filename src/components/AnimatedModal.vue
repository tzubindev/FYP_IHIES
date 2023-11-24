<template>
    <div>
        <!-- Background overlay -->
        <div v-if="modalOpen" class="bg-gray/95 absolute w-full h-full z-50">
            <div
                v-if="modalOpen"
                class="modal max-w-[70%] w-full fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white shadow-md animate-scrollOpen"
            >
                <p class="w-full text-center text-lg font-bold">
                    Medical Record
                </p>
                <p class="text-center italic text-xs font-bold mb-4">
                    {{ title }}
                </p>
                <slot />
                <button
                    @click="closeModal"
                    class="bg-red hover:bg-gray/80 transition text-white px-2.5 py-0.5 float-right"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            modalOpen: this.isOpen,
        };
    },
    watch: {
        isOpen(newVal) {
            this.modalOpen = newVal;
        },
    },
    methods: {
        openModal() {
            this.modalOpen = true;
        },
        closeModal() {
            this.modalOpen = false;
            this.$emit("update:isOpen", false); // Emit event to update prop in parent
        },
    },
};
</script>

<!-- Tailwind CSS styles -->
<style>
@keyframes scrollOpen {
    from {
        transform: translate(-50%, -150%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}

/* Apply the scrolling-like animation to the modal */
.animate-scrollOpen {
    animation: scrollOpen 0.8s ease-in-out;
}
</style>
