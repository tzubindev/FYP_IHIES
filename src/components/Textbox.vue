<template>
    <div>
        <!-- Normal Textbox -->
        <div
            v-if="!isPassword"
            class="px-3 p-1 flex items-center cursor-pointer hover:bg-black/10 transition w-full h-14 bg-transparent rounded-3xl border-y-2 shadow-lg"
            :class="[customClass]"
        >
            <div v-if="hasIcon">
                <img :src="getIconUrl()" class="w-7 h-7 mr-2" />
            </div>
            <div class="form mr-6">
                <input
                    type="text"
                    autocomplete="off"
                    required
                    class="pl-4 text-lg cursor-pointer outline-none bg-transparent w-full"
                    :value="modelValue"
                    :style="{ color: colour }"
                    @input="$emit('update:modelValue', $event.target.value)"
                />
                <label class="label-name">
                    <span class="content-name" :style="{ color: colour }">
                        {{ placeholder }}
                    </span>
                </label>
            </div>
        </div>

        <!-- Password Textbox -->
        <div
            v-if="isPassword"
            class="px-3 p-1 flex items-center cursor-pointer hover:bg-black/10 transition w-full h-14 bg-transparent rounded-3xl border-y-2 shadow-lg"
            :class="[customClass]"
        >
            <div v-if="hasIcon">
                <img :src="getIconUrl()" class="w-7 h-7 mr-2" />
            </div>
            <div class="form">
                <input
                    :type="currentType"
                    autocomplete="off"
                    required
                    class="pl-4 text-lg outline-none cursor-pointer bg-transparent w-full"
                    :value="modelValue"
                    :style="{ color: colour }"
                    @input="$emit('update:modelValue', $event.target.value)"
                />
                <label class="label-name">
                    <span class="content-name" :style="{ color: colour }">
                        {{ placeholder }}
                    </span>
                </label>
            </div>

            <!-- Eyes icon -->
            <div>
                <div
                    v-if="!isPasswordShownClicked"
                    @click="
                        isPasswordShownClicked = !isPasswordShownClicked;
                        currentType = 'password';
                    "
                >
                    <img src="../assets/eye_closed.svg" class="w-7 h-7" />
                </div>
                <div
                    v-if="isPasswordShownClicked"
                    @click="
                        isPasswordShownClicked = !isPasswordShownClicked;
                        currentType = 'text';
                    "
                >
                    <img src="../assets/eye_open.svg" class="w-7 h-7" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.form {
    width: 100%;
    position: relative;
    height: 100%;
    overflow: hidden;
}

.form input {
    width: 100%;
    height: 100%;
    color: black;
    border: none;
    background: transparent;
    text-align: center;
}

.content-name {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding-bottom: 5px;
    transition: all 0.6s ease;
}
.form input:focus {
    outline: none;
}
.form input:focus + .label-name .content-name,
.form input:valid + .label-name .content-name {
    transform: translateY(-50%);
    font-size: 14px;
    left: 10px;
}
</style>

<script>
export default {
    props: {
        placeholder: String,
        isPassword: {
            type: Boolean,
            default: false,
        },
        modelValue: String,
        hasIcon: Boolean,
        iconSrc: String,
        colour: {
            type: String,
            default: "black",
        },
        customClass: String,
    },
    data() {
        return {
            currentType: "password",
            isPasswordShownClicked: true,
        };
    },
    emits: ["update:modelValue"],
    methods: {
        getIconUrl() {
            return new URL(`${this.iconSrc}`, import.meta.url);
        },
    },
};
</script>
