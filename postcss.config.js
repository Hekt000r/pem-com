// tailwind.config.js

import typography from '@tailwindcss/typography';
import postcss from '@tailwindcss/postcss';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [
    typography,
    postcss,
  ],
};

export default config;
