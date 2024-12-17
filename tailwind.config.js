/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-red': '#FF0000',
        'game-blue': '#0000FF',
        'game-green': '#00FF00',
        'game-yellow': '#FFFF00',
        'game-purple': '#800080',
        'game-orange': '#FFA500',
      },
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}

