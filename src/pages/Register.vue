<template>
    <div class="min-h-screen relative flex justify-center items-center">
        Register
    </div>
</template>

<script>
export default {
    data() {
        return {
            // user: {
            //     id: null,
            //     pw: null,
            // },
            errors: [],
            // modalTitle: "Custom Modal",
            // show: false,
            api_url: "http://127.0.0.1:3000",
        };
    },
    methods: {
        // login(e) {
        //     this.errors = [];
        //     if (this.user.id && this.user.pw) {
        //         this.axios
        //             .post(`${this.api_url}/login`, this.user)
        //             .then((response) => {
        //                 console.log(response.data);
        //             });
        //         return true;
        //     }
        //     if (!this.user.id) this.errors.push("ID No. Required");
        //     if (!this.user.pw) this.errors.push("Password Required");
        //     e.preventDefault();
        // },
        // sendOTP() {
        //     console.log("Sending otp");
        //     this.axios
        //         .post(`${this.api_url}/otp`, { id: "012345678910" })
        //         .then((response) => {
        //             console.log(response.data);
        //         });
        //     return true;
        // },
        // confirm() {
        //     this.sendOTP();
        //     this.show = false;
        // },
        // openModal() {
        //     this.show = true;
        // },
        // cancel() {
        //     this.show = false;
        // },
    },
};
</script>

<style>
* {
    user-select: none;
}
</style>
