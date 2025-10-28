/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#435161',
          accent: '#C5A47E',
          'accent-bright': '#ffdc7f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Montserrat', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
