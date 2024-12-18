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
        'bounce-short': 'bounce 1s ease-in-out 2',
        'scale-up': 'scaleUp 0.5s ease-out',
        'shine': 'shine 2s linear infinite',
        'particle': 'particle 0.5s ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'flash': 'flash 0.5s',
        'shake': 'shake 0.5s',
        'dropIn': 'dropIn 0.5s ease-out',
      },
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(0.5) translateY(50px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        particle: {
          '0%': { 
            transform: 'translate(0, 0) scale(1)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translate(var(--tx), var(--ty)) scale(0)',
            opacity: '0'
          }
        },
        flash: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        dropIn: {
          '0%': { 
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
      }
    },
  },
  plugins: [],
}

