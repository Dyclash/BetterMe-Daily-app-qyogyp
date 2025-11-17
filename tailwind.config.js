
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'jet-black': '#0A0A0A',
        'neon-blue': '#00D9FF',
        'cyan-highlight': '#00FFF0',
        'dark-gray': '#1A1A1A',
        'medium-gray': '#2A2A2A',
      },
    },
  },
  plugins: [],
}
