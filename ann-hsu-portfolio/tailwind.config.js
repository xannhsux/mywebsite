/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    light: '#1B2A4E',
                    DEFAULT: '#002147',
                    dark: '#050A14',
                },
            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
                script: ['Ma Shan Zheng', 'cursive'],
            },
        },
    },
    plugins: [],
}
