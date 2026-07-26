/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f1',
          100: '#dcf0de',
          200: '#bce1c1',
          300: '#8fca98',
          400: '#5cab69',
          500: '#3a8d49',
          600: '#2a7038',
          700: '#22592e',
          800: '#1e4727',
          900: '#193b22',
          950: '#0a2012',
        },
        accent: {
          100: '#fbe4f1',
          300: '#f2a8d3',
          500: '#e560ac',
          700: '#b83885',
        },
        surface: {
          light: '#f7f8f6',
          card: '#ffffff',
          dark: '#0f1a13',
          darkCard: '#16241a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px 0 rgb(0 0 0 / 0.06)',
      },
    },
  },
  plugins: [],
};
