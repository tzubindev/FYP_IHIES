<template>
    <div class="min-h-screen relative">
        <div
            class="flex-wrap font-serif overflow-hidden h-screen flex-col flex justify-start items-center bg-gray/5"
        >
            <!-- small Upper -->
            <!-- <div class="w-full h-1/3 flex justify-center items-end">
                <img src="../assets/login_cover_mobile.svg" class="h-full" />
            </div> -->

            <!-- Lower -->
            <div
                class="abs-centre w-full sm:w-3/5 sm:p-8 sm:pt-0 pt-0 backdrop-blur bg-gray/80 p-4 h-full sm:h-fit sm:bg-gray/80 text-sm flex-wrap flex flex-col justify-center items-center"
            >
                <img
                    src="../assets/login_cover_mobile.svg"
                    class="sm:h-40 h-60 sm:pl-4 pl-10 w-full mb-2"
                />
                <h1
                    class="font-extrabold text-2xl text-white w-full text-center mb-8"
                >
                    {{ $t("healthie") }}
                </h1>

                <!-- Main panel -->
                <div class="w-full text-center">
                    <!-- ADD ICONS FOR UID AND PASSWORD -->
                    <form
                        id="login-form"
                        class="w-full"
                        @submit.prevent="login"
                        novalidate="true"
                    >
                        <Textbox
                            placeholder="ID No."
                            v-model="user.id"
                            hasIcon
                            iconSrc="../assets/uid.svg"
                            customClass="border-white/60"
                            colour="white"
                        />
                        <Textbox
                            placeholder="Password"
                            class="mt-5"
                            isPassword
                            v-model="user.pw"
                            hasIcon
                            iconSrc="../assets/pw.svg"
                            customClass="border-white/60"
                            colour="white"
                        />
                        <div class="w-full mt-3 mb-6 flex justify-end px-2">
                            <p
                                @click="openModal('FORGOT PASSWORD')"
                                class="text-white cursor-pointer hover:text-red -full transition-all p-1 px-4"
                            >
                                Forgot your password?
                            </p>
                        </div>

                        <Button
                            title="LOGIN"
                            customClass="mt-5 bg-red hover:bg-red/70 text-white"
                            submit
                            medium
                        />
                        <Button
                            title="REGISTER"
                            medium
                            customClass="mt-3 bg-white hover:bg-mintage/90 hover:text-white text-gray"
                            @click="leadTo('Register')"
                        />
                    </form>
                </div>
            </div>

            <div
                class="absolute top-1/2 -translate-y-1/2 w-[200%] -z-10 h-1/2 bg-mintage/60 rotate-[15deg]"
            ></div>
        </div>

        <!-- Forget Password Modal -->
        <Transition>
            <Modal
                v-if="show"
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
                        class="w-full p-2 pr-4 bg-orange/30 -3xl shadow-md"
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
                                class="w-full bg-gray p-2 border-b-2 outline-none text-center"
                            />
                        </div>
                    </div>
                    <div class="flex justify-end mt-4">
                        <Button
                            medium
                            title="Send OTP"
                            customClass="bg-white hover:bg-mintage hover:text-white transition text-center hover w-1/2"
                            @click="handleOTP('send')"
                            v-if="!is_otp_sent && !is_auth && !is_sending_otp"
                        />

                        <!-- Loading animation -->
                        <div
                            class="animate-pulse bg-white/20 shadow p-4 max-w-sm w-full mx-auto"
                            v-if="(!otp.id && is_auth) || is_sending_otp"
                        >
                            <div class="flex justify-center items-center">
                                <p>Sending OTP...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </Transition>

        <!-- Loader -->
        <Loader
            :loading="is_loading && !show"
            class="z-20 w-4/5 absolute"
        ></Loader>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                id: null,
                pw: null,
                role: null,
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
            is_sending_otp: false,
        };
    },
    methods: {
        async login(e) {
            // Temp dev purpose
            // this.leadTo("Patient");
            // return;

            // End here

            this.errors = [];

            if (this.user.id && this.user.pw) {
                this.is_loading = true;
                this.is_auth = true;

                await this.axios
                    .post(`${this.api_url}/login`, this.user)
                    .then((response) => {
                        console.log("start auth");
                        this.show = false;
                        console.log(response.data);
                        if (
                            response.data.type === "Error" &&
                            response.data.message === "Authentication Failed"
                        ) {
                            this.errors.push(response.data.description);
                            this.has_error;
                            this.is_loading = false;
                        }

                        if (!response.data.message.authentication) {
                            this.$swal({
                                title: "Authentication Failed",
                                text: "Unmatched ID No. and password.",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            this.has_error = true;
                        }

                        this.user.role = response.data.message.role
                            ? response.data.message.role
                            : null;
                    });
            }
            console.log("finish auth");

            if (this.is_auth && !this.has_error) {
                this.show = true;
                this.modal_title = "LOGIN";
                await this.handleOTP("send");
                this.is_loading = false;
            } else {
                this.is_loading = false;
                this.is_auth = false;
                this.has_error = false;
                if (!this.user.id) this.errors.push("ID No. Required");
                if (!this.user.pw) this.errors.push("Password Required");
            }

            if (this.errors.length) {
                const errorsHTML =
                    "<p class='w-full text-left pl-2'>Errors:</p>" +
                    "<div class='flex flex-wrap text-left p-2'>" +
                    this.errors
                        .map(
                            (e) =>
                                "<div class='mb-2 mr-2  bg-gray text-red font-light p-2 px-5'>" +
                                e +
                                "</div>"
                        )
                        .join("") +
                    "</div>";
                this.$swal({
                    title: "Login",
                    html: errorsHTML,
                    icon: "error",
                });
            }

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

            // Clean up data
            this.otp.id = this.otp.id.substring(0, 3);
            this.otp.code = this.otp.code.trim();

            // Send req
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
            console.log(response_data);
            return response_data;
        },
        async handleOTP(mode) {
            if (mode === "send") {
                this.is_sending_otp = true;
                if (this.is_auth) {
                    await this.sendOTP(this.user.id, "login");
                } else {
                    await this.sendOTP(
                        this.forget_password_id,
                        "forgetPassword"
                    );
                }
                this.is_sending_otp = false;
            }
            if (mode === "receive") {
                if (this.is_auth) {
                    console.log("Login: ", this.user.id);
                    const msg = await this.receiveOTP(this.user.id, "login");
                    console.log("Two-Factor Auth:", msg);
                    console.log(msg.message === "VER_SUCCESS");
                    if (msg.message.split("|")[0] === "VER_SUCCESS") {
                        if (this.user.role === "patient")
                            this.leadTo("Patient", {
                                passcode: msg.message.split("|")[1],
                            });
                        else if (this.user.role === "medicalpersonnel")
                            this.leadTo("MedicalPersonnel", {
                                passcode: msg.message.split("|")[1],
                            });
                    }
                } else {
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
        leadTo(targetPage, params) {
            switch (targetPage) {
                case "Register":
                    console.log(`Redirect to ${targetPage}.`);
                    this.$router.push("/register");
                    break;
                case "Patient":
                    console.log(`Redirect to ${targetPage} Dashboard.`);
                    sessionStorage.setItem("passcode", params.passcode);
                    this.$router.push({
                        path: `/dashboard/patient/${this.user.id}`,
                    });
                    break;
                case "MedicalPersonnel":
                    console.log(`Redirect to ${targetPage} Dashboard.`);
                    sessionStorage.setItem("passcode", params.passcode);
                    this.$router.push({
                        path: `/dashboard/medical-personnel/${this.user.id}`,
                    });
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
