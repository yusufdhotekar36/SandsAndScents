/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdf8f3',
          100: '#faf0e4',
          200: '#f4ddc4',
          300: '#ecc49b',
          400: '#e2a470',
          500: '#d88b4f',
          600: '#ca7643',
          700: '#a85f39',
          800: '#874d35',
          900: '#6e402d',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        desert: {
          50: '#faf7f2',
          100: '#f4ede0',
          200: '#e8d8c0',
          300: '#d9be97',
          400: '#c8a06c',
          500: '#bc8a4f',
          600: '#af7843',
          700: '#916139',
          800: '#765033',
          900: '#60422b',
        }
      },
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
        'elegant': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'sand-drift': 'sand-drift 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'sand-drift': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)' },
        }
      },
      backgroundImage: {
        'desert-gradient': 'linear-gradient(135deg, #fdf8f3 0%, #f4ddc4 50%, #ecc49b 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        'sand-texture': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f4ddc4\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3Ccircle cx=\"53\" cy=\"53\" r=\"1\"/%3E%3Ccircle cx=\"37\" cy=\"23\" r=\"1\"/%3E%3Ccircle cx=\"23\" cy=\"37\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
