/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./LP/*.html",
    "./form/*.html",
    "./staff/*.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A96AE',
        secondary: '#F59E0B',
        accent: '#E0F2F7',
        base: '#F7FBFA',
        text: '#374151',
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        display: ['"Zen Kaku Gothic New"', 'sans-serif'],
        number: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(74, 150, 174, 0.15)',
      }
    }
  },
  plugins: [],
}
