/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "primary-blue": '#263252'
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'] 
      },
      height: {
        'laptop-image': '650px',
        'vh-80': '90vh',
        'bg-image': '720px',

      },
    },

  },
  plugins: [],
}
