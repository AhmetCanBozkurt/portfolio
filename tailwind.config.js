/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode renkleri
        light: {
          background: '#ffffff',
          text: '#1a1a1a',
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#2563eb',
          surface: '#f8fafc',
          border: '#e2e8f0',
        },
        // Dark mode renkleri
        dark: {
          background: '#000000',
          text: '#ffffff',
          primary: '#3b82f6',
          secondary: '#94a3b8',
          accent: '#60a5fa',
          surface: '#111827',
          border: '#1f2937',
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
} 