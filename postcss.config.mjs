import typography from '@tailwindcss/typography';
// Note: "@tailwindcss/postcss" does not exist as a plugin — it should be removed.

export default {
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
    // remove "@tailwindcss/postcss" – it’s not a valid plugin
  ],
};
