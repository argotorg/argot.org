// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['var(--font-karla)', ...fontFamily.sans],
      mono: ['var(--font-inconsolata)', ...fontFamily.mono],
    },
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      colors: {
        primary: {
          DEFAULT: '#2D2725',
          300: '#5B4D49',
          400: '#423835',
          500: '#2D2725',
          600: '#24201E',
          700: '#1A1717',
        },
        anthracite: {
          DEFAULT: '#2D2725',
          300: '#5B4D49',
          400: '#423835',
          500: '#2D2725',
          600: '#24201E',
          700: '#1A1717',
        },
        amber: {
          DEFAULT: '#D49B3F',
          300: '#F3CC88',
          400: '#E7B865',
          500: '#D49B3F',
          600: '#BA7F19',
          700: '#966316',
        },
        ecru: {
          DEFAULT: '#EADBCA', // Different color from below
          300: '#F6EADD',
          400: '#E9DED2',
          500: '#DBCCBB',
          600: '#BEAC97',
          700: '#A1907C',
        },
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.anthracite.500'),
              '&:hover': {
                color: `${theme('colors.anthracite.600')}`,
              },
              code: { color: theme('colors.anthracite.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
              marginBottom: '0.5rem',
            },
            h3: {
              fontWeight: '600',
              marginBottom: '0.5rem',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
            'ul > li': {
              '&::marker': {
                color: theme('colors.anthracite.500'),
              },
            },
            hr: {
              borderColor: theme('colors.anthracite.300'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.anthracite.500'),
              '&:hover': {
                color: `${theme('colors.anthracite.400')}`,
              },
              code: { color: theme('colors.anthracite.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
            'ul > li': {
              '&::marker': {
                color: theme('colors.ecru.500'),
              },
            },
            hr: {
              borderColor: theme('colors.ecru.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  safelist: [
    'divide-anthracite-300',
    'dark:divide-ecru-300',
    'border-anthracite-300',
    'dark:border-ecru-300',
  ],
}
