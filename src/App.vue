<template>
    <div id="app" class="overflow-hidden">
        <router-view></router-view>
    </div>
    <div
        class="absolute bottom-0 w-full text-center p-1 bg-black/30 text-white"
    >
        &copy; 2023 -HEALTHIE-
    </div>
</template>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* width */
::-webkit-scrollbar {
    width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
    background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #222;
}
</style>

<script>
export default {
    computed: {},
    methods: {},
    mounted() {
        this.$router.push("./login");
    },
};
</script>
