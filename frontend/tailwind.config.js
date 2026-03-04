/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgfi: {
          blue: '#0E4A7A',  // Le bleu profond de gauche
          olive: '#A9B18F'  // Le beige/olive de droite
        }
      }
    },
  },
  plugins: [],
}