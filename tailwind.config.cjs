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
      },
      screens: {
        'small': '360px',
      },
      animation: {
        scale: 'scale 0.1s ease-in-out',
        fly: 'fly .3s ease-in-out',
      }
    },
  },
  plugins: [],
}
