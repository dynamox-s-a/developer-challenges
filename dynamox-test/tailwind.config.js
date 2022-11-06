/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{html,js,jsx}',
    './src/components/**/*.{html,js,jsx}',
    './src/layouts/**/*.{html,js,jsx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark-blue': '#263252',
      },
    },
  },
  plugins: [],
}
