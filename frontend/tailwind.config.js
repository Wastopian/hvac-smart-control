/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kinetic color palette
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Temperature-based colors
        cold: {
          100: '#e6f3ff',
          200: '#b3d9ff',
          300: '#80bfff',
          400: '#4da6ff',
          500: '#1a8cff',
          600: '#0073e6',
          700: '#005bb3',
          800: '#004280',
          900: '#002a4d',
        },
        warm: {
          100: '#fff5e6',
          200: '#ffe6b3',
          300: '#ffd480',
          400: '#ffc24d',
          500: '#ffb01a',
          600: '#e69900',
          700: '#b37600',
          800: '#805200',
          900: '#4d2f00',
        },
        hot: {
          100: '#ffe6e6',
          200: '#ffb3b3',
          300: '#ff8080',
          400: '#ff4d4d',
          500: '#ff1a1a',
          600: '#e60000',
          700: '#b30000',
          800: '#800000',
          900: '#4d0000',
        },
        // Comfort zones
        comfort: {
          excellent: '#10b981',
          good: '#34d399',
          moderate: '#fbbf24',
          poor: '#f59e0b',
          critical: '#ef4444',
        },
        // Kinetic background
        canvas: {
          light: '#fafafa',
          dark: '#0a0a0a',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 8s ease-in-out infinite',
        'flow': 'flow 4s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'orb-float': 'orb-float 6s ease-in-out infinite',
        'particle-float': 'particle-float 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            filter: 'brightness(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
            filter: 'brightness(1.1)',
          },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(10px) translateY(-5px)' },
          '50%': { transform: 'translateX(-5px) translateY(-10px)' },
          '75%': { transform: 'translateX(-10px) translateY(5px)' },
        },
        flow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'orb-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            borderRadius: '60% 40% 30% 70%',
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(180deg)',
            borderRadius: '30% 60% 70% 40%',
          },
        },
        'particle-float': {
          '0%': { 
            transform: 'translateY(100vh) translateX(0px)',
            opacity: '0',
          },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { 
            transform: 'translateY(-100px) translateX(100px)',
            opacity: '0',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      gridTemplateColumns: {
        'kinetic': 'repeat(auto-fit, minmax(300px, 1fr))',
        'floor': 'repeat(12, 1fr)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 