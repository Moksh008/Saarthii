/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ec5b13',
        'bg-light': '#f8f6f6',
        'bg-dark': '#221610',
      },
      fontFamily: {
        display: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
