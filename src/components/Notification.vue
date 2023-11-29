<template>
    <transition name="bounce">
        <div
            class="fixed right-3 z-10 mt-12 max-w-[24rem] w-full origin-top-right bg-white shadow-sm shadow-gray outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1"
            v-if="show"
        >
            <div class="p-2" role="none">
                <a
                    v-for="(item, index) in items"
                    :key="index"
                    @click="change_current(item)"
                    class="block text-sm border-b border-gray/30 py-1"
                    :class="{ 'border-none': index === items.length - 1 }"
                    role="menuitem"
                    tabindex="-1"
                >
                    <p
                        class="hover:bg-gray hover:text-white cursor-pointer text-left w-full p-2"
                    >
                        {{ $t(item) }}
                    </p>
                </a>
            </div>
        </div>
    </transition>
</template>

<style>
.bounce-enter-active {
    animation: bounce-in 0.5s;
}
.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
    0% {
        transform: scale(0);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {};
    },
    methods: {
        change_current(item) {
            this.$emit("selectedItem", item);
        },
    },
};
</script>
