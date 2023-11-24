<template>
    <div class="inline-block text-left">
        <div>
            <button
                type="button"
                class="outline-none inline-flex w-full justify-center gap-x-1.5 bg-transparent px-3 py-1 text-sm hover:bg-gray-50"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true"
            >
                <slot />
                <svg
                    class="-mr-1 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
        </div>

        <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->

        <transition name="bounce">
            <div
                class="absolute right-11 z-10 mt-3 w-40 origin-top-right bg-white shadow-sm shadow-gray outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabindex="-1"
                v-if="show"
            >
                <div class="py-1" role="none">
                    <a
                        v-for="(item, index) in menuItems"
                        :key="index"
                        @click="change_current(item)"
                        class="block p-1 px-1.5 text-sm"
                        role="menuitem"
                        tabindex="-1"
                        ><p
                            class="hover:bg-gray hover:text-white cursor-pointer text-left w-full p-2"
                        >
                            {{ $t(item) }}
                        </p></a
                    >
                </div>
            </div>
        </transition>
    </div>
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
        menuItems: {
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
