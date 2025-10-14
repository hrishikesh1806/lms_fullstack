
/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; 

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // ==========================================================
            // 1. CUSTOM KEYFRAMES (ALL ANIMATION KEYFRAMES REMOVED)
            // ==========================================================
            keyframes: {
                // Kept only if 'pulse' is a default Tailwind class being re-used, otherwise remove.
            },
            
            // ==========================================================
            // 2. CUSTOM ANIMATION UTILITIES (ALL CUSTOM ANIMATIONS REMOVED)
            // ==========================================================
            animation: {
                // Kept only if 'pulse' is a default Tailwind class being re-used, otherwise remove.
            },
            
            // ==========================================================
            // 3. CUSTOM FILTERS 
            // ==========================================================
            filter: {
                'indigo-600': 'invert(31%) sepia(35%) saturate(2256%) hue-rotate(213deg) brightness(97%) contrast(92%)',
            },

            // ==========================================================
            // 4. OTHER CUSTOM EXTENSIONS
            // ==========================================================
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            gridTemplateColumns:{
                'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
            },
            spacing: {
                'section-height': '500px',
            },
            fontSize: {
                'default': ['15px', '21px'],
                'course-deatails-heading-small': ['26px', '36px'],
                'course-deatails-heading-large': ['36px', '44px'],
                'home-heading-small': ['28px', '34px'], 
                'home-heading-large': ['48px', '56px'],
            },
            maxWidth: {
                'course-card': '424px',
            },
            boxShadow: {
                'custom-card': '0px 4px 15px 2px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}