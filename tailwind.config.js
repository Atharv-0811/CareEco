/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121417',
        surface: '#1a1d21',
        card: '#1f2226',
        accent: '#2a2d31',
        accent2: '#242830',
        primary: '#3a8f9c',
        danger: '#e57373',
        text: '#fff',
        muted: '#555',
        border: '#333',
        gray: {
          400: '#9ca3af',
          600: '#4b5563',
          800: '#1f2937',
        },
      },
    },
  },
  plugins: [],
};
