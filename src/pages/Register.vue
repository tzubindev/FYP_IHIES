<template>
    <div
        class="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-mintage to-violet/50"
    >
        <div class="bg-white/70 p-5 py-10 -2xl backdrop-blur-sm">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    class="w-[80px] m-auto"
                    src="../assets/app_logo.png"
                    alt="HEALTHIE"
                />
                <h2
                    class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                >
                    Registration
                </h2>
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    id="login-form"
                    class="mt-8"
                    @submit.prevent="register"
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
                    <Textbox
                        placeholder="Confirmed Password"
                        class="mt-3"
                        isPassword
                        v-model="user.confirmed_pw"
                        hasIcon
                        iconSrc="../assets/pw.svg"
                    />
                    <Textbox
                        placeholder="Email"
                        class="mt-3"
                        v-model="user.email"
                        hasIcon
                        iconSrc="../assets/email.svg"
                    />

                    <!-- Erro message span -->
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
                        title="REGISTER"
                        customClass="mt-2 bg-mintage hover:bg-gray/30 text-white"
                        submit
                        large
                    />
                </form>

                <div class="mt-6 flex">
                    <hr class="grow" />
                </div>

                <Button
                    title="SIGN IN"
                    medium
                    customClass="mt-4 hover:bg-white bg-cool text-white hover:text-black text-center"
                    @click="leadTo('Login')"
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
