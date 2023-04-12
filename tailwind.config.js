/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-primary': '#263252',
        'blue-light': '#F4F7FC',
        'black-title': '#37383D',
      },
      backgroundImage: {
        'hero': "url('../../src/assets/grafismo.png')",
      }
    },
  },
  plugins: [],
}
