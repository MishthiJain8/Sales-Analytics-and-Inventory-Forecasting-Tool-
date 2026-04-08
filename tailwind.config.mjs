/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                beige: {
                    DEFAULT: '#F5F5DC',
                    50: '#FDFDF5',
                    100: '#F9F9EC',
                    200: '#F5F5DC',
                    300: '#EBEBC0',
                    400: '#DEDE9F',
                    500: '#CFCF7A',
                },
                softgreen: {
                    DEFAULT: '#8FBC8F',
                    100: '#D4EAD4',
                    200: '#B8D8B8',
                    300: '#8FBC8F',
                    400: '#6BA06B',
                    500: '#4F874F',
                },
                darkgreen: {
                    DEFAULT: '#004d00',
                    50: '#E6F2E6',
                    100: '#B3D9B3',
                    200: '#80C080',
                    300: '#4DA64D',
                    400: '#1A8D1A',
                    500: '#004d00',
                    600: '#003B00',
                    700: '#002800',
                    800: '#001600',
                    900: '#000500',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'earth-gradient': 'linear-gradient(135deg, #F5F5DC 0%, #D4EAD4 50%, #8FBC8F 100%)',
            },
        },
    },
    plugins: [],
};
