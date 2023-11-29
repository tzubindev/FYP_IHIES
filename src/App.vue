<template>
    <div id="app" class="overflow-hidden">
        <router-view></router-view>
    </div>
    <div
        class="absolute bottom-0 w-full text-center p-1 text-xs bg-black/30 text-white"
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
    width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
    background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #aaa;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>

<script>
export default {};
</script>
