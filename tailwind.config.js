/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./src/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            transparent: "transparent",
            red: "#ee674a",
            orange: "#f7a77f",
            yellow: "#fcf0b6",
            pink: "#f4bbda",
            green: "#c6e1b5",
            teal: "#7aa49c",
            blue: "#779ecd",
            violet: "#8f66cd",
            warm: "#866c65",
            cool: "#5a7683",
            white: "#ffffff",
            black: "#000000",
        },
        extend: {},
    },
    plugins: [],
};
