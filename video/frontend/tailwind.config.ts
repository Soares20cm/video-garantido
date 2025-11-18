import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd4cc',
          300: '#ffb8aa',
          400: '#ff9580',
          500: '#ff7a5c',
          600: '#fa6347',
          700: '#e84a2e',
          800: '#c23d24',
          900: '#a03520',
        },
        salmon: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd4cc',
          300: '#ffb8aa',
          400: '#ff9580',
          500: '#ff7a5c',
          600: '#fa6347',
          700: '#e84a2e',
          800: '#c23d24',
          900: '#a03520',
        },
      },
    },
  },
  plugins: [],
}
export default config
