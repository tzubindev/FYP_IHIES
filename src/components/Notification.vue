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
                    class="hover:bg-gray hover:text-white text-[14px] gap-2 border-b border-gray/30 py-1 px-3 flex items-center"
                    :class="{ 'border-none': index === items.length - 1 }"
                    role="menuitem"
                    tabindex="-1"
                >
                    <img
                        v-if="item.type === 'schedule'"
                        class="bg-gray rounded-full p-1.5 h-8 w-8"
                        src="../assets/schedule.svg"
                    />
                    <img
                        v-else
                        class="bg-gray rounded-full p-1.5 h-8 w-8"
                        src="../assets/notification_white.svg"
                    />

                    <div
                        class="grid grid-cols-1 cursor-pointer text-left w-full p-2"
                    >
                        <div class="flex justify-between items-center">
                            <p class="font-extrabold">{{ item.from }}</p>
                            <p class="italic">
                                {{
                                    this.convert_timestamp(
                                        item.created_timestamp
                                    )
                                }}
                            </p>
                        </div>
                        <p class="font-semibold">{{ item.sender }}</p>
                        <p class="font-light truncate">
                            {{ item.message }}
                        </p>
                    </div>
                </a>

                <a
                    v-if="!items.length"
                    class="text-gray/70 w-full flex justify-center"
                    >{{ $t("no_notification") }}</a
                >
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
        convert_timestamp(t) {
            const differenceInMilliseconds = new Date().getTime() - t;
            console.log(t);
            const intervals = {
                seconds: 1000,
                minutes: 60 * 1000,
                hours: 60 * 60 * 1000,
                days: 24 * 60 * 60 * 1000,
                months: 31 * 24 * 60 * 60 * 1000,
                years: 365 * 24 * 60 * 60 * 1000,
            };

            const phrases = {
                seconds: "seconds ago",
                minutes: "minutes ago",
                hours: "hours ago",
                days: "days ago",
                months: "months ago",
                years: "years ago",
            };

            let lowestPhrase = "";
            let lowestVal = 0;
            for (const [intervalName, intervalInMilliseconds] of Object.entries(
                intervals
            )) {
                const val = differenceInMilliseconds / intervalInMilliseconds;
                if (lowestVal === 0) {
                    lowestPhrase = intervalName;
                    lowestVal = val;
                } else {
                    if (val > 1) {
                        const isChanged = lowestVal > val;
                        lowestPhrase = isChanged ? intervalName : lowestPhrase;
                        lowestVal = isChanged ? val : lowestVal;
                    }
                    console.log(Math.floor(lowestVal), lowestPhrase);
                }
            }

            return String(Math.floor(lowestVal)) + " " + phrases[lowestPhrase];
        },
    },
};
</script>
