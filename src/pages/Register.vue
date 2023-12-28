<template>
    <div
        class="flex min-h-screen relative justify-center items-center bg-gray overflow-hidden"
    >
        <div
            class="p-8 pt-0 max-h-[90%] overflow-y-auto h-fit bg-white/20 backdrop-blur z-[5] flex flex-wrap justify-center items-center w-full sm:w-3/5 overflow-hidden"
        >
            <img
                src="../assets/login_cover_mobile.svg"
                class="h-32 sm:pl-4 pl-10 w-full"
            />
            <div class="w-full mt-2 text-center text-2xl font-bold text-white">
                {{ $t("registration") }}
            </div>

            <div class="w-full">
                <form
                    id="login-form"
                    class="text-[14px]"
                    @submit.prevent="register"
                    novalidate="true"
                >
                    <Textbox
                        :placeholder="$t('id_no_or_pp')"
                        v-model="user.id"
                        hasIcon
                        iconSrc="../assets/uid.svg"
                        customClass="border-white/60"
                        colour="white"
                    />
                    <Textbox
                        :placeholder="$t('password')"
                        class="mt-2"
                        isPassword
                        v-model="user.pw"
                        hasIcon
                        iconSrc="../assets/pw.svg"
                        customClass="border-white/60"
                        colour="white"
                    />
                    <Textbox
                        :placeholder="$t('confirmed_password')"
                        class="mt-2"
                        isPassword
                        v-model="user.confirmed_pw"
                        hasIcon
                        iconSrc="../assets/pw.svg"
                        customClass="border-white/60"
                        colour="white"
                    />
                    <Textbox
                        :placeholder="$t('email')"
                        class="mt-2"
                        v-model="user.email"
                        hasIcon
                        iconSrc="../assets/email.svg"
                        customClass="border-white/60"
                        colour="white"
                    />

                    <!-- Erro message span -->
                    <div
                        v-if="errors.length"
                        class="text-left text-red mt-2 p-2 py-0.5 bg-yellow backdrop-blur"
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
                        :title="$t('register')"
                        customClass="mt-2 bg-red hover:bg-red/70  text-white"
                        submit
                        medium
                    />
                </form>

                <div class="border-t mt-4 pt-4 border-white/70">
                    <Button
                        :title="$t('sign_in')"
                        medium
                        customClass="hover:bg-mintage bg-white text-gray hover:text-white text-center "
                        @click="leadTo('Login')"
                    />
                </div>
            </div>
        </div>

        <div
            class="absolute top-1/2 -translate-y-1/2 w-[200%] z-0 h-1/2 bg-darkred rotate-[15deg]"
        ></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                id: null,
                pw: null,
                confirmed_pw: null,
                email: null,
            },
            errors: [],
            // modalTitle: "Custom Modal",
            // show: false,
            api_url: "http://127.0.0.1:3000",
            VALIDATION: {
                ID: "id",
                PW: "pw",
                EMAIL: "email",
            },
        };
    },
    methods: {
        register(e) {
            this.errors = [];

            if (
                this.user.id &&
                this.user.pw &&
                this.user.pw === this.user.confirmed_pw &&
                this.user.email
            ) {
                // Validation
                const validations = [
                    this.validation(this.VALIDATION.ID, this.user.id),
                    this.validation(this.VALIDATION.PW, this.user.pw),
                    this.validation(this.VALIDATION.EMAIL, this.user.email),
                ];
                validations.forEach((v) => (v ? this.errors.push(v) : null));
                if (!this.errors.length) {
                    // this.axios
                    //     .post(`${this.api_url}/register`, this.user)
                    //     .then((response) => {
                    //         console.log(response.data);
                    //     });
                    return true;
                }
            }
            if (!this.user.id) this.errors.push("ID No. Required");
            if (!this.user.pw) this.errors.push("Password Required");
            if (!this.user.confirmed_pw)
                this.errors.push("Confirmed Password Required");
            if (!this.user.email) this.errors.push("Email Required");
            if (this.user.pw !== this.user.confirmed_pw)
                this.errors.push("Unmatched Passwords.");

            e.preventDefault();
        },
        // sendOTP() {
        //     console.log("Sending otp");
        //     this.axios
        //         .post(`${this.api_url}/otp`, { id: "012345678910" })
        //         .then((response) => {
        //             console.log(response.data);
        //         });
        //     return true;
        // },
        // type: [ id, pw, email ]
        validation(type, target) {
            switch (type) {
                case this.VALIDATION.ID:
                    // ID should be 12 characters in length
                    if (target.length === 12)
                        return; // No errors, return nothing
                    else return "ID must be 12 characters long"; // Invalid ID, return error message

                case this.VALIDATION.PW:
                    // Password should be:
                    // 1. at least 8 characters long
                    // 2. at least 1 lowercase letter
                    // 3. at least 1 uppercase letter
                    // 4. at least 1 digit
                    // 5. at least 1 special character

                    const lowercaseRegex = /[a-z]/;
                    const uppercaseRegex = /[A-Z]/;
                    const digitRegex = /\d/;
                    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

                    if (target.length < 8)
                        return "Password must be at least 8 characters long";

                    if (!lowercaseRegex.test(target))
                        return "Password must contain at least 1 lowercase letter";
                    if (!uppercaseRegex.test(target))
                        return "Password must contain at least 1 uppercase letter";

                    if (!digitRegex.test(target))
                        return "Password must contain at least 1 digit";

                    if (!specialCharRegex.test(target))
                        return "Password must contain at least 1 special character";

                    return; // No errors, return nothing

                case this.VALIDATION.EMAIL:
                    // Email validation using a simple regex pattern
                    const emailRegex =
                        /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

                    if (emailRegex.test(target))
                        return; // No errors, return nothing
                    else return "Invalid email format"; // Invalid email, return an array of error messages

                default:
                    return; // Handle other cases or types here
            }
        },
        leadTo(targetPage) {
            switch (targetPage) {
                case "Login":
                    console.log(`Redirect to ${targetPage}.`);
                    this.$router.push("./login");
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
