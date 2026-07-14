import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0FA3AD',
          50: '#E6F7F8',
          100: '#CCEFF1',
          200: '#99DFE3',
          300: '#66CFD5',
          400: '#33BFC7',
          500: '#0FA3AD',
          600: '#0C828A',
          700: '#096268',
          800: '#064146',
          900: '#032123',
        },
        sunshine: {
          DEFAULT: '#FFC93C',
          50: '#FFF9E8',
          100: '#FFF2D1',
          300: '#FFDE85',
          500: '#FFC93C',
          700: '#E8A800',
        },
        coral: {
          DEFAULT: '#FF8C42',
          500: '#FF8C42',
          600: '#F5701A',
        },
        bubblegum: {
          DEFAULT: '#FF6FA5',
          500: '#FF6FA5',
          600: '#E84C88',
        },
        leaf: {
          DEFAULT: '#4CAF7D',
          500: '#4CAF7D',
          600: '#3B8F64',
        },
        cream: '#FFFBF2',
        ink: '#1E2A2E',
      },
      fontFamily: {
        display: ['var(--font-baloo)', 'system-ui', 'sans-serif'],
        body: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '2.5rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
      boxShadow: {
        card: '0 12px 32px -12px rgba(15, 163, 173, 0.25)',
        button: '0 8px 20px -6px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}
export default config
