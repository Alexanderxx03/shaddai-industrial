/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'impact': ['"Bebas Neue"', 'Outfit', 'sans-serif'],
        'display': ['Outfit', 'sans-serif'],
        'sans': ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'ind-blue': '#0052cc',
        'ind-blue-light': '#00beff',
        'ind-blue-dark': '#002bb0',
        'ind-dark-bg': '#080c16',
        'ind-dark-card': '#0f172a',
        'ind-black': '#080c16',
        'primary': '#0052cc',
        'dark': '#080c16'
      }
    }
  },
  plugins: [],
}
