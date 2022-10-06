/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    fontSize: {
      xs: [ '80px', '93.92px'],
      sm: [ '40px', '46.96px'],
      base: ['24px', '28px'],
    },
  },
    extend: { 
      colors: {
        'blue': '#263252',
        'gray': '#F4F7FC',
        'light-gray': '#454545',
        'blue2': '#5D7A8C',
      },
  },
  plugins: [],
}
