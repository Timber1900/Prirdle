module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      keyframes: {
        scale: {
          '0%': { transform: 'scale(0%)' },
          '40%': { transform: 'scale(110%)' },
          '100%': { transform: 'scale(100%)' },
        },
        fly: {
          '0%': { transform: 'translateY(40%) scale(0%)' },
          '100%': { transform: 'translateY(0%) scale(100%)' },
        },
        shake: {
          '0%': { transform: 'translateX(0%)' },
          '10%': { transform: 'translateX(-1%)' },
          '20%': { transform: 'translateX(1%)' },
          '30%': { transform: 'translateX(-1%)' },
          '40%': { transform: 'translateX(1%)' },
          '50%': { transform: 'translateX(-1%)' },
          '60%': { transform: 'translateX(1%)' },
          '70%': { transform: 'translateX(-1%)' },
          '80%': { transform: 'translateX(1%)' },
          '90%': { transform: 'translateX(-1%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      },
      screens: {
        'small': '400px',
      },
      animation: {
        scale: 'scale 0.1s ease-in-out',
        fly: 'fly .3s ease-in-out',
        shake: 'shake .5s ease-in-out',
      }
    },
  },
  plugins: [],
}
