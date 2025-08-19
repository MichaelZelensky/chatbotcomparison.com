import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f9ff',
          100: '#eaf1ff',
          200: '#cfe0ff',
          300: '#a7c2ff',
          400: '#6f96ff',
          500: '#3e6dff',
          600: '#224cf2',
          700: '#1a39c4',
          800: '#182f99',
          900: '#182b7a'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config