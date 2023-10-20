<template>
    <div class="min-h-screen relative">
        <!-- < Small Screen Size -->
        <div
            class="md:hidden font-serif overflow-x-hidden h-screen flex justify-center items-center p-1 bg-tranparent bg-gradient-to-br from-teal to-violet/60"
        >
            <!-- Login Side -->
            <div
                class="p-5 md:p-0 flex justify-center items-center bg-white/70 rounded-2xl w-11/12 h-[600px] backdrop-blur-sm shadow-lg"
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
                        @submit.prevent="login"
                        novalidate="true"
                    >
                        <Textbox
                            placeholder="ID No."
                            v-model="user.id"
                            hasIcon
                            iconSrc="../assets/uid.svg"
                        />
                        <Textbox
                            placeholder="Password"
                            class="mt-3"
                            isPassword
                            v-model="user.pw"
                            hasIcon
                            iconSrc="../assets/pw.svg"
                        />

                        <div
                            v-if="errors.length"
                            class="text-left text-red mt-1 p-1 pb-0"
                        >
                            <div
                                v-for="item in errors"
                                :key="item.id"
                                class="text-xm"
                            >
                                * {{ item }}
                            </div>
                        </div>
                        <div v-if="!errors.length" class="mt-8"></div>

                        <!-- Add TYPE SUBMIT HERE -->
                        <Button
                            title="LOGIN"
                            customClass="hover:rounded-md mt-2 bg-gradient-to-r from-teal to-violet
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
                        @click="leadTo('Register')"
                    />
                    <Button
                        title="FORGOT PASSWORD"
                        medium
                        customClass="mt-2 bg-black text-white hover:bg-red"
                        @click="openModal"
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

        <Modal
            v-model="show"
            title="Forget Password"
            @confirm="confirm"
            @cancel="cancel"
            modalType="error"
        >
            <div class="mb-2">Please Type In Your ID Number</div>
            <Textbox
                placeholder="ID No."
                colour="white"
                v-model="forgetPassword_id"
            />
        </Modal>
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
            forgetPassword_id: null,
            errors: [],
            modalTitle: "Custom Modal",
            show: false,
            api_url: "http://127.0.0.1:3000",
        };
    },
    methods: {
        login(e) {
            this.errors = [];
            if (this.user.id && this.user.pw) {
                this.axios
                    .post(`${this.api_url}/login`, this.user)
                    .then((response) => {
                        console.log(response.data);
                    });
                return true;
            }

            if (!this.user.id) this.errors.push("ID No. Required");
            if (!this.user.pw) this.errors.push("Password Required");

            e.preventDefault();
        },
        sendOTP() {
            console.log("Sending otp");
            this.axios
                .post(`${this.api_url}/otp`, { id: this.forgetPassword_id })
                .then((response) => {
                    console.log(response.data);
                });
            return true;
        },
        confirm() {
            this.sendOTP();
            this.forgetPassword_id = null;
            this.show = false;
        },
        openModal() {
            this.show = true;
        },
        cancel() {
            this.show = false;
        },
        leadTo(targetPage) {
            switch (targetPage) {
                case "Register":
                    console.log(`Redirect to ${targetPage}.`);
                    this.$router.push("./register");
                    break;
            }
        },
    },
};
</script>

<style>
* {
    user-select: none;
}
</style>
