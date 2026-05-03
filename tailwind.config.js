/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FD8B00',
          blue: '#375C91',
          sand: '#F7F4EF',
          cream: '#F6F1E8',
          ink: '#102033',
          mist: '#E8EEF7',
          gold: '#FFD33A',
        },
      },
      boxShadow: {
        soft: '0 24px 64px rgba(16, 32, 51, 0.10)',
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
