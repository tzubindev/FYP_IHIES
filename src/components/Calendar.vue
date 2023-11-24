<!-- CustomCalendar.vue -->
<template>
    <div class="max-w-[600px] mx-auto">
        <!-- Top calendar bar -->
        <div
            class="flex justify-between text-center items-center p-4 text-white bg-gray"
        >
            <button
                @click="prevMonth"
                class="px-2 p-0.5 bg-red text-gray font-bold transition hover:bg-red/50"
            >
                &lt;
            </button>
            <h2 class="text-lg font-bold">
                {{ currentMonth.format("MMMM YYYY") }}
            </h2>
            <button
                @click="nextMonth"
                class="px-2 p-0.5 bg-red text-gray font-bold transition hover:bg-red/50"
            >
                &gt;
            </button>
        </div>

        <!-- Day columns -->
        <div class="bg-gray/90 text-white p-2">
            <div class="grid grid-cols-7">
                <div
                    class="w-full h-full flex justify-center items-center p-1 py-0.5 bg-red/80 text-white"
                    v-for="day in weekdays"
                    :key="day.id"
                >
                    <div
                        class="text-sm p-1 py-0.5 w-full h-full flex justify-center items-center"
                    >
                        {{ day }}
                    </div>
                </div>
            </div>

            <div
                v-for="(week, index) in calendar"
                :key="index"
                class="grid grid-cols-7"
            >
                <div
                    v-for="day in week"
                    :key="day.date"
                    class="p-1 flex justify-center items-center -full cursor-pointer transition-all duration-300"
                    @click="selectDate(day)"
                    :class="{
                        'bg-none -none': !day,
                    }"
                    style="aspect-ratio: 1"
                >
                    <div
                        class="transition hover:text-gray w-full h-full font-semibold flex justify-center items-center"
                        :class="{
                            'hover:bg-white/80':
                                day && day.date !== selectedDate?.date,
                            'bg-blue/80 ':
                                selectedDate && selectedDate.date === day.date,
                            'bg-darkgreen ': isToday(day.date),
                            'bg-darkyellow ':
                                hasEvents(day) && !isTodayOrPast(day.date),
                            'bg-darkred':
                                hasEvents(day) && isTodayOrPast(day.date),
                        }"
                    >
                        {{ day.day }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["selectedEvents"],
    data() {
        return {
            currentMonth: this.$dayjs(),
            selectedDate: null,
            weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            events: [
                { title: "Event 1", date: "2023-11-01", time: "10:00 AM" },
                {
                    title: "Event 2 asdnbjoqnwnaso dasnkd oas nkdqwodqnko",
                    date: "2023-11-30",
                    time: "02:00 PM",
                },
                {
                    title: "Event 2 asdnbjoqnwnaso dasnkd oas nkdqwodqnko",
                    date: "2023-11-30",
                    time: "02:00 PM",
                },
                {
                    title: "Event 2 asdnbjoqnwnaso dasnkd oas nkdqwodqnko",
                    date: "2023-11-30",
                    time: "02:00 PM",
                },
                {
                    title: "Event 2 asdnbjoqnwnaso dasnkd oas nkdqwodqnko",
                    date: "2023-11-30",
                    time: "02:00 PM",
                },
                {
                    title: "Event 2 asdnbjoqnwnaso dasnkd oas nkdqwodqnko",
                    date: "2023-11-30",
                    time: "02:00 PM",
                },
                // Add more events as needed
            ],
        };
    },
    computed: {
        calendar() {
            const firstDay = this.currentMonth.startOf("month");
            const lastDay = this.currentMonth.endOf("month");
            const days = [];
            let currentDate = firstDay;

            days.push(
                Array(this.getFirstDayOfMonth(firstDay.$y, firstDay.$M)).fill(0)
            );

            while (
                currentDate.isBefore(lastDay) ||
                currentDate.isSame(lastDay, "day")
            ) {
                const week = Array(7)
                    .fill(0)
                    .map(() => {
                        const day = {
                            date: currentDate.format("YYYY-MM-DD"),
                            day: currentDate.date(),
                            events: this.getEventsForDate(currentDate),
                        };
                        currentDate = currentDate.add(1, "day");
                        return day;
                    });
                days.push(week);
            }

            for (let i = 0; i < days.length; i++) {
                if (i !== days.length - 1 && days[i + 1].length > 0) {
                    const needed_days = 7 - days[i].length;
                    days[i] = days[i].concat(days[i + 1].slice(0, needed_days));
                    days[i + 1] = days[i + 1].slice(needed_days);
                } else {
                    if (days[i][0] && days[i][0].day < 20) {
                        days.pop();
                    } else {
                        // Fill in the last row until having 7 elements
                        while (days[i].length < 7) {
                            const day = {
                                date: currentDate.format("YYYY-MM-DD"),
                                day: currentDate.date(),
                                events: this.getEventsForDate(currentDate),
                            };
                            days[i].push(day);
                            currentDate = currentDate.add(1, "day");
                        }
                    }
                }
            }

            return days;
        },
    },
    methods: {
        getEventsForDate(date) {
            // Format the date as "YYYY-MM-DD"
            const formattedDate = this.$dayjs(date).format("YYYY-MM-DD");

            // Return events for the formatted date
            return this.events.filter((event) => event.date === formattedDate);
        },
        prevMonth() {
            this.currentMonth = this.currentMonth.subtract(1, "month");
        },
        nextMonth() {
            this.currentMonth = this.currentMonth.add(1, "month");
        },
        selectDate(day) {
            this.selectedDate = day;
            this.$emit("selectedEvents", this.getEventsForDate(day.date));
        },
        getFirstDayOfMonth(year, month) {
            // Month parameter is 0-based in JavaScript (0 = January, 11 = December)
            const firstDay = new Date(year, month, 1);
            return firstDay.getDay(); // Returns a number (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        },
        isToday(date) {
            // Helper function to check if the date is today
            const today = new Date();
            return date === today.toISOString().split("T")[0];
        },
        hasEvents(day) {
            return day.events && day.events.length > 0;
        },
        isTodayOrPast(date) {
            const today = new Date().toISOString().split("T")[0];
            return date <= today;
        },
    },
};
</script>
