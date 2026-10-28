/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080c15',
          darker: '#04070d',
          surface: '#0f172a',
          card: '#131e36',
          border: '#1e293b',
          accent: '#38bdf8',
          emerald: '#10b981',
          crimson: '#ef4444',
          gold: '#f59e0b',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
