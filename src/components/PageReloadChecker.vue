<template>
    <div>
        <h1>Page Reload Checker</h1>

        <p v-if="isReload">This page has been reloaded.</p>
    </div>
</template>

<script>
import performance from "performance";

export default {
    computed: {
        isReload() {
            return performance.navigation.type === "reload";
        },
    },
};
</script>
