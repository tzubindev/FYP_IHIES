<template>
    <!-- < Medium Screen Size -->
    <div
        class="md:hidden font-serif overflow-hidden h-screen flex justify-center items-center p-5 bg-tranparent bg-gradient-to-br from-cool to-violet"
    >
        <!-- Login Side -->
        <div
            class="p-5 px-10 md:p-0 flex justify-center items-center bg-white/70 rounded-2xl w-4/5 h-[600px] backdrop-blur-sm shadow-lg"
        >
            <!-- Main panel -->
            <div class="w-full h-full text-center">
                <!-- Title -->
                <div class="mt-8">
                    <!-- DO SOMETHING HERE LATER -->
                    <!-- <div class="">HEALTHIE</div> -->
                    <img
                        src="../assets/app_logo_bgrm.png"
                        class="w-[250px] m-auto"
                    />
                    <p class="italic text-sm text-black/80 mt-2">
                        Integrated Healthcare Information <br />
                        Exchange System
                    </p>
                </div>

                <!-- ADD ICONS FOR UID AND PASSWORD -->
                <form
                    id="login-form"
                    class="mt-10"
                    @submit="checkForm"
                    novalidate="true"
                >
                    <Textbox
                        placeholder="ID No."
                        inputType="text"
                        v-model="user.id"
                    />
                    <Textbox
                        placeholder="Password"
                        inputType="password"
                        class="mt-3"
                        isPassword
                        v-model="user.pw"
                    />

                    <div v-if="errors.length" class="text-left text-red mt-1">
                        <b class="text-sm"
                            >Please correct the following error(s):</b
                        >
                        <div
                            v-for="item in errors"
                            :key="item.id"
                            class="text-xs"
                        >
                            * {{ item }}
                        </div>
                    </div>
                    <div v-if="errors.length" class="mt-1"></div>

                    <!-- Add TYPE SUBMIT HERE -->
                    <Button
                        title="LOGIN"
                        customClass="bg-gradient-to-r from-cool/70 to-violet
                    text-white "
                        submit
                        large
                    />
                </form>

                <!-- Seperate line -->
                <div class="mt-6 flex justify-center items-center">
                    <hr class="grow" />
                    <div class="w-1/4">Other</div>
                    <hr class="grow" />
                </div>

                <Button
                    title="REGISTER"
                    medium
                    customClass="mt-4 bg-white hover:bg-cool hover:text-white"
                />
                <Button
                    title="FORGOT PASSWORD"
                    medium
                    customClass="mt-2 bg-black text-white hover:bg-red"
                />
            </div>
        </div>
    </div>

    <!-- >= Medium Screen Size -->
    <div class="hidden md:grid grid-cols-2">
        <!-- Login Side -->
        <div></div>

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
export default {
    data() {
        return {
            user: {
                id: null,
                pw: null,
            },
            errors: [],
        };
    },
    methods: {
        checkForm(e) {
            this.errors = [];
            if (this.user.id && this.user.pw) return true;

            if (!this.user.id) this.errors.push("ID Required");
            if (!this.user.pw) this.errors.push("Password Required");

            e.preventDefault();
        },
    },
};
</script>

<style>
* {
    user-select: none;
}
</style>