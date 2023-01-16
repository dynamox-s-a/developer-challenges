/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#F4F7FC",
        blue: "#263252",
        black: "#37383D",
        gray: "#454545",
      },
    },
  },
  plugins: [],
};
