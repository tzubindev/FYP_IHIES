<template>
    <div class="min-h-screen relative">
        <!-- NOTE -->
        <!-- 1) gradient theme: bg-gradient-to-br from-teal to-violet/60 -->

        <!-- < Small Screen Size -->
        <div
            class="md:hidden font-serif overflow-x-hidden h-screen flex justify-center items-center p-1 bg-gradient-to-br from-mintage to-violet/50"
        >
            <!-- Login Side -->
            <div
                class="p-5 md:p-0 flex justify-center items-center bg-white/70 rounded-2xl w-11/12 h-[600px] backdrop-blur-sm shadow-lg"
            >
                <!-- Main panel -->
                <div class="w-full h-full text-center">
                    <!-- Title -->
                    <div class="mt-5">
                        <!-- DO SOMETHING HERE LATER -->
                        <!-- <div class="">HEALTHIE</div> -->
                        <img
                            src="../assets/app_logo.png"
                            class="w-[80px] m-auto"
                        />
                        <h2
                            class="mt-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray"
                        >
                            Sign in to your account
                        </h2>
                    </div>

                    <!-- ADD ICONS FOR UID AND PASSWORD -->
                    <form
                        id="login-form"
                        class="mt-8"
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
                            customClass="mt-2 bg-mintage hover:bg-gray/30 text-white"
                            submit
                            large
                        />
                    </form>

                    <!-- Seperate line -->
                    <div class="mt-6 flex justify-center items-center">
                        <hr class="grow" />
                        <div class="w-1/6">OR</div>
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
                        customClass="mt-2 bg-gray/70 text-white hover:bg-red "
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

        <!-- Forget Password Modal -->
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
                v-model="forgetPassword.id"
            />
            <div class="mb-2 mt-4" v-if="isOTPSent">
                Please Type In Your OTP
            </div>
            <div class="mb-4">
                <!-- OTP Span -->
                <div class="grid grid-cols-5 h-[40px]" v-if="isOTPSent">
                    <input
                        v-model="forgetPassword.otp_id"
                        readonly
                        class="bg-transparent outline-none text-center"
                    />
                    <input
                        type="text"
                        v-model="forgetPassword.otp"
                        class="w-full col-span-4 bg-transparent border-b-2 outline-none text-center"
                    />
                </div>
                <div class="flex justify-end mt-4">
                    <Button
                        medium
                        title="Send OTP"
                        customClass="bg-white hover:bg-mintage hover:text-white transition text-center hover w-1/2 "
                        @click="sendOTP"
                        v-if="!isOTPSent"
                    />
                </div>
            </div>
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

            forgetPassword: {
                id: null,
                otp_id: null,
                otp: null,
            },
            isOTPSent: false,
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
                        if (
                            response.data.type === "Error" &&
                            response.data.message === "Authentication Failed"
                        )
                            this.errors.push(response.data.description);

                        if (!response.data.message.authentication)
                            this.errors.push("Wrong Password.");
                    });
                return true;
            }

            if (!this.user.id) this.errors.push("ID No. Required");
            if (!this.user.pw) this.errors.push("Password Required");

            e.preventDefault();
        },
        async sendOTP() {
            if (!this.forgetPassword.id) {
                this.notify(
                    "Invalid Input!",
                    "Please type in your ID No.",
                    "error"
                );
                return;
            }

            console.log("Sending otp");
            let responseData;
            await this.axios
                .post(`${this.api_url}/otp`, { id: this.forgetPassword.id })
                .then((response) => {
                    responseData = response.data;
                });
            console.log(responseData);
            this.forgetPassword.otp_id = responseData.message.id + " - ";
            this.isOTPSent = true;
        },
        confirm() {
            // verify the otp code
            // Need a function here
            this.forgetPassword_id = null;
            this.show = false;
        },
        openModal() {
            this.show = true;
        },
        cancel() {
            this.show = false;
            this.forgetPassword.id = null;
            this.forgetPassword.otp_id = null;
            this.forgetPassword.otp = null;
            this.isOTPSent = false;
        },
        leadTo(targetPage) {
            switch (targetPage) {
                case "Register":
                    console.log(`Redirect to ${targetPage}.`);
                    this.$router.push("./register");
                    break;
            }
        },
        notify(title, msg, type) {
            this.$notify({
                title: title,
                text: msg,
                type: type,
            });
        },
    },
};
</script>

<style>
* {
    user-select: none;
}
</style>
