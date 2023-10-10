<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
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
