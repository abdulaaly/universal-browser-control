/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./sidepanel.html",
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#08090b',
        surface: {
          DEFAULT: '#0e1015',
          elevated: '#14171f',
          card: '#191d27',
          hover: '#1f2430',
        },
        hairline: {
          DEFAULT: '#232834',
          soft: 'rgba(255, 255, 255, 0.06)',
          strong: 'rgba(255, 255, 255, 0.14)',
        },
        ink: '#f4f4f6',
        body: '#c4c8d4',
        mute: '#7a8296',
        ash: '#484f63',
        brand: {
          accent: '#6366f1',
          primary: '#5e6ad2',
          light: '#8083ff',
          dim: '#c0c1ff',
        },
        status: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          cyan: '#06b6d4',
        },
        timeline: {
          plan: '#dfa88f',
          index: '#9fc9a2',
          read: '#9fbbe0',
          exec: '#c0a8dd',
          done: '#e5c07b',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        tactile: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        elevated: '0 8px 24px -4px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
      }
    },
  },
  plugins: [],
}
