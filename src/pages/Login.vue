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
                class="p-5 md:p-0 flex justify-center items-center bg-white/70 rounded-2xl w-11/12 backdrop-blur-sm shadow-lg"
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
                        @click="openModal('FORGOT PASSOWRD')"
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
            :title="modal_title"
            @confirm="handleOTP('receive')"
            @cancel="cancel"
            modalType="error"
        >
            <div class="mb-2" v-if="!is_auth">
                Please Type In Your ID Number
            </div>
            <Textbox
                placeholder="ID No."
                colour="white"
                v-model="forget_password_id"
                v-if="!is_auth"
                class="mb-4"
            />
            <!-- Hidden part, will be shown after the otp is sent -->
            <div class="mb-2" v-if="is_otp_sent || is_auth">
                Please Type In Your OTP
            </div>
            <div class="mb-4">
                <!-- OTP Span -->
                <div
                    class="w-full p-2 pr-4 bg-orange/30 rounded-3xl shadow-md"
                    v-if="is_otp_sent"
                >
                    <div class="flex justify-start items-center">
                        <input
                            v-model="otp.id"
                            readonly
                            class="max-w-[80px] p-1 bg-transparent outline-none text-center"
                        />
                        <input
                            type="text"
                            v-model="otp.code"
                            class="w-full bg-gray rounded-2xl p-2 border-y-2 outline-none text-center"
                        />
                    </div>
                </div>
                <div class="flex justify-end mt-4">
                    <Button
                        medium
                        title="Send OTP"
                        customClass="bg-white hover:bg-mintage hover:text-white transition text-center hover w-1/2"
                        @click="handleOTP('send')"
                        v-if="!is_otp_sent && !is_auth"
                    />

                    <!-- Loading animation -->
                    <div
                        class="animate-pulse bg-white/20 shadow rounded-md p-4 max-w-sm w-full mx-auto"
                        v-if="!otp.id && is_auth"
                    >
                        <div class="flex justify-center items-center">
                            <p>Sending OTP...</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

        <!-- Loader -->
        <Loader :loading="is_loading" class="w-4/5"></Loader>
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
            forget_password_id: null,
            otp: {
                id: null,
                code: null,
            },
            is_otp_sent: false,
            errors: [],
            modal_title: null,
            show: false,
            api_url: "http://127.0.0.1:3000",
            is_loading: false,
            is_auth: false,
            has_error: false,
        };
    },
    methods: {
        async login(e) {
            this.errors = [];
            if (this.user.id && this.user.pw) {
                this.is_loading = true;
                this.is_auth = true;
                await this.axios
                    .post(`${this.api_url}/login`, this.user)
                    .then((response) => {
                        this.show = false;

                        console.log(response.data);
                        if (
                            response.data.type === "Error" &&
                            response.data.message === "Authentication Failed"
                        ) {
                            this.errors.push(response.data.description);
                            this.has_error;
                        }

                        if (!response.data.message.authentication) {
                            this.$swal({
                                title: "Authentication Failed",
                                text: "Unmatched ID No. and password.",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        }
                    });
            }

            if (this.is_auth && !this.has_error) {
                this.show = true;
                this.modal_title = "LOGIN";
                await this.handleOTP("send");
                this.is_loading = false;
            }
            if (!this.user.id) this.errors.push("ID No. Required");
            if (!this.user.pw) this.errors.push("Password Required");

            e.preventDefault();
        },
        async sendOTP(otp_uid, otp_type) {
            if (!otp_uid) {
                this.$swal({
                    title: "Invalid Input!",
                    text: "Please type in your ID No.",
                    icon: "error",
                });
                return;
            }

            console.log("Sending otp");
            let response_data;
            await this.axios
                .post(`${this.api_url}/otp`, {
                    id: otp_uid,
                    type: otp_type,
                    mode: "send",
                })
                .then((response) => {
                    response_data = response.data;
                });

            console.log(response_data);
            this.otp.id = response_data.message.id + " - ";
            this.is_otp_sent = true;
            this.$swal({
                title: "OTP",
                text: "Please check OTP in your mail.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
            return response_data;
        },
        async receiveOTP(otp_uid, otp_type) {
            if (!otp_uid) {
                this.$swal({
                    title: "Invalid Input!",
                    text: "Please type in your ID No.",
                    icon: "error",
                });
                return;
            }

            console.log("Verifying otp");
            let response_data;
            await this.axios
                .post(`${this.api_url}/otp`, {
                    id: otp_uid,
                    type: otp_type,
                    mode: "receive",
                    otp: this.otp,
                })
                .then((response) => {
                    response_data = response.data;
                });
            return response_data;
        },
        async handleOTP(mode) {
            if (mode === "send") {
                if (this.is_auth) {
                    this.sendOTP(this.user.id, "login");
                } else {
                    this.sendOTP(this.forget_password_id, "forgetPassword");
                }
            }
            if (mode === "receive") {
                if (this.is_auth) {
                    console.log("Login: ", this.user.id);
                    await this.receiveOTP(this.user.id, "login");
                } else {
                    // await this.receiveOTP();
                    console.log("Forget Password: ", this.forget_password_id);
                    await this.receiveOTP(
                        this.forget_password_id,
                        "forgetPassword"
                    );
                    this.forget_password_id = null;
                    this.show = false;
                }
                this.cancel();
            }
        },
        openModal(title) {
            this.modal_title = title;
            this.show = true;
        },
        cancel() {
            this.show = false;
            this.forget_password_id = null;
            this.otp.id = null;
            this.otp.code = null;
            this.is_otp_sent = false;
            this.is_auth = false;
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
