/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepBlue: {
          50: '#e8f0fe',
          100: '#d0e1fd',
          200: '#a8c4fb',
          300: '#7aa7f9',
          400: '#4c8af7',
          500: '#1e6df5',
          600: '#1555c4',
          700: '#114093',
          800: '#0e2b62',
          900: '#0b1631',
        },
        purple: {
          50: '#f5f0ff',
          100: '#e9d5ff',
          200: '#d4a5ff',
          300: '#b875ff',
          400: '#9c4dff',
          500: '#8025ff',
          600: '#6614cc',
          700: '#4c0f99',
          800: '#330a66',
          900: '#1a0533',
        },
      },
    },
  },
  plugins: [],
}
