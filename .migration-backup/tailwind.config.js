/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#2f251b',
          medium: '#5f4a2f',
          darker: '#1e1812',
          gold: '#c8a56b',
          bronze: '#9c7742',
          cream: '#f8f4ee',
          ink: '#19140f',
          accent: '#7d5a2f',
        },
      },
      boxShadow: {
        luxury: '0 10px 30px rgba(25,20,15,0.08)',
        'luxury-lg': '0 20px 45px rgba(25,20,15,0.12)',
      },
      borderRadius: {
        luxury: '1.25rem',
      },
      fontFamily: {
        'tan-mon-cheri': ['Tan Mon Cheri', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
