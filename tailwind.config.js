/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dyna: {
          blue: "#263252",
          white: "#F4F7FC",
          gray: "#37383D"
        }
      },
      fontFamily: {
        Raleway: "Raleway",
      },
      backgroundImage: {
        "home": "url('src/assets/grafismo.png')"
      }
    },
  },
  plugins: [],
}

