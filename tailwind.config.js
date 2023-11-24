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
            darkred: "#b83c25",
            orange: "#f7a77f",
            yellow: "#fcf0b6",
            darkyellow: "#c5b376",
            pink: "#f4bbda",
            green: "#c6e1b5",
            darkgreen: "#9dbd8f",
            teal: "#7aa49c",
            blue: "#779ecd",
            violet: "#8f66cd",
            warm: "#866c65",
            cool: "#5a7683",
            white: "#ffffff",
            black: "#000000",
            gray: "#474540",
            mintage: "#7BC1B7",
        },
        extend: {},
    },
    plugins: [],
};
