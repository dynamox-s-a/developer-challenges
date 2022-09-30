/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        "primary-blue": '#263252',
        "title-blue": '#37383D',
        "bg-light-cyan-blue": '#F4F7FC',
        "text-sensors": '#454545',
        "name-sensors": '#5D7A8C',
        'button-sent': '#0165DB',
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'] 
      },
      height: {
        'laptop-image': '650px',
        'vh-80': '90vh',
        'bg-image': '720px',
        'footer-heigth': '450px'

      },
      fontSize: {
        'primary-font-size': '40px',
        'secondary-font-size': '30px',

      },
      width: {
        'button-width': '184px',
        'input-width': '426px'
      }
    },

  },
  plugins: [],
}
