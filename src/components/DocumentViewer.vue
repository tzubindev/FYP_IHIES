<template>
    <div class="relative">
        <div class="absolute top-2 right-2 z-20">
            <div class="flex w-full justify-end gap-1">
                <button
                    @click="zoomIn"
                    class="bg-gray/50 text-white w-5 h-5 flex justify-center items-center hover:bg-gray transition"
                >
                    +
                </button>
                <button
                    @click="zoomOut"
                    class="bg-gray/50 text-white w-5 h-5 flex justify-center items-center hover:bg-gray transition"
                >
                    -
                </button>
            </div>
        </div>

        <VuePdfEmbed
            ref="pdfViewer"
            :src="src"
            :height="current_height"
            :width="current_width"
            :annotation-layer="true"
            :scale="current_scale"
            class="overflow-y-auto max-h-full w-full p-2"
        />
    </div>
</template>

<script>
import VuePdfEmbed from "vue-pdf-embed";

export default {
    components: {
        VuePdfEmbed,
    },
    props: {
        src: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            current_scale: 1,
            current_height: 800,
            current_width: 600,
            ORIGINAL: { HEIGHT: 800, WIDTH: 600 },
        };
    },
    methods: {
        zoomIn() {
            if (this.$refs.pdfViewer && this.current_scale < 1.5) {
                this.current_scale += 0.1;
                this.changeSize();
            }
        },
        zoomOut() {
            if (this.$refs.pdfViewer && this.current_scale > 0.6) {
                this.current_scale -= 0.1;
                this.changeSize();
            }
        },
        changeSize() {
            this.current_height = this.ORIGINAL.HEIGHT * this.current_scale;
            this.current_width = this.ORIGINAL.WIDTH * this.current_scale;
        },
    },
};
</script>

<style scoped></style>
