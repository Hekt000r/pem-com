/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography');

const config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}", // adjust path if needed
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [
    typography
  ],
};

module.exports = config;
