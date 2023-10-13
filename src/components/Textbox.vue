<template>
    <div>
        <div
            v-if="!isPassword"
            class="px-3 flex items-center cursor-pointer hover:bg-black/10 transition w-full h-14 bg-transparent rounded-3xl p-3 border-y-2 shadow-lg"
        >
            <div v-if="hasIcon">
                <img :src="getIconUrl()" class="w-7 h-7 mr-2" />
            </div>
            <input
                :type="inputType"
                :placeholder="placeholder"
                class="pl-4 outline-none bg-transparent w-full placeholder:text-black/70"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </div>
        <div
            v-if="isPassword"
            class="px-3 flex items-center cursor-pointer hover:bg-black/10 transition w-full h-14 bg-transparent rounded-3xl p-3 border-y-2 shadow-lg"
        >
            <div v-if="hasIcon">
                <img :src="getIconUrl()" class="w-7 h-7 mr-2" />
            </div>
            <input
                :type="currentType"
                :placeholder="placeholder"
                class="pl-4 outline-none bg-transparent w-full placeholder:text-black/70"
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            />

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

<script>
export default {
    props: {
        placeholder: String,
        inputType: String,
        isPassword: {
            type: Boolean,
            default: false,
        },
        customClass: String,
        modelValue: String,
        hasIcon: Boolean,
        iconSrc: String,
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
