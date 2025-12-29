/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
