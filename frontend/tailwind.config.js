/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#F8CB46',
          green: '#0C831F',
          darkgreen: '#085C15',
          lightgreen: '#E8F5E9',
          accent: '#FF3269',
        }
      }
    },
  },
  plugins: [],
}
