<template>
    <div
        class="font-serif overflow-hidden h-screen flex justify-center items-center md:grid grid-cols-2 p-5 m:p-0 md:bg-tranparent bg-gradient-to-br from-cool to-violet"
    >
        <!-- Login Side -->
        <div
            class="p-5 md:p-0 flex justify-center items-center bg-white/30 rounded-2xl w-4/5 h-4/5 backdrop-blur-sm shadow-lg"
        >
            <!-- Main panel -->
            <div class="w-full h-full text-center">
                <!-- Title -->
                <div class="mt-10">
                    <!-- DO SOMETHING HERE LATER -->
                    <div class="">HEALTHIE</div>
                    <p class="italic text-sm">All Connected.</p>
                </div>

                <form class="mt-10">
                    <input
                        type="text"
                        class="placeholder:text-black/70 text-center w-full h-14 bg-transparent rounded-3xl outline-none p-3 border-y-2 shadow-lg"
                        placeholder="ID Number"
                    />
                    <input
                        type="password"
                        class="placeholder:text-black/70 text-center w-full h-14 mt-2 bg-transparent rounded-3xl outline-none p-3 border-y-2 shadow-lg"
                        placeholder="Password"
                    />
                    <button
                        type="submit"
                        class="mt-8 bg-white text-xl text-black w-full py-4 rounded-3xl shadow-xl"
                    >
                        LOGIN
                    </button>
                </form>

                <div class="mt-10 flex justify-center items-center">
                    <hr class="w-1/3" />
                    <div class="w-1/3">Registered?</div>
                    <hr class="w-1/3" />
                </div>
            </div>
        </div>

        <!-- Cover -->
        <div class="p-5 hidden md:block">
            <div
                class="bg-cool rounded-2xl w-full h-full flex inset-0 relative"
            >
                <img
                    src="../assets/login_cover_bgrm.png"
                    class="m-auto rounded-b-full hidden m:w-5/6"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style></style>
