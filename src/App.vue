<template>
    <div id="app">
        <router-view></router-view>
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
