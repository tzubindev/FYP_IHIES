<template>
    <div
        class="w-11/12 h-4 rounded bg-white/30 flex items-center p-1 overflow-hidden"
    >
        <div class="w-full h-2 bg-gray animate-expand-shrink rounded-sm"></div>
    </div>
</template>

<style>
.animate-expand-shrink {
    animation: expandShrink 4s infinite;
}

@keyframes expandShrink {
    0% {
        transform: scaleX(0);
        transform-origin: left;
    }
    50% {
        transform: scaleX(0.9);
        transform-origin: center;
    }
    100% {
        transform: scaleX(0);
        transform-origin: right;
    }
}
</style>
