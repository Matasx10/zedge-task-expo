/** @type {import('tailwindcss').Config} */
module.exports = {
  // Added the /app folder and ensured /components is recursive
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    // ! Did not bother to add here
    extend: {
      colors: {},
    },
  },
  plugins: [],
};
