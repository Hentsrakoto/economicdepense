/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Mode (Beige Theme)
        beige: {
          50: '#F9F9F5',
          100: '#F2F2EB',
          200: '#E6E6D8',
          300: '#D9D9C2',
          400: '#CFCFA8',
          500: '#BDBDA0',
          800: '#5C5C4D',
          900: '#3E3E34',
        },
        light: {
          bg: '#F2F2EB',       // beige-100
          surface: '#FFFFFF',
          primary: '#8B4513',  // Sample brown/earthy
          text: '#3E3E34',     // Dark grayish/brown
          textSec: '#8C8C7D',
        },
        // Dark Mode (Existing)
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          primary: '#BB86FC',
          secondary: '#03DAC6',
          text: '#FFFFFF',
          textSec: '#A0A0A0',
        }
      }
    },
  },
  plugins: [],
}
