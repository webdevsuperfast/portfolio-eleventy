import defaultTheme from 'tailwindcss/defaultTheme'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import tailwindcssDebugScreens from 'tailwindcss-debug-screens'

export default {
  darkMode: 'class',
  content: [
    './src/**/.njk',
    './src/_scripts/*.js',
    './src/_styles/*.css',
    './src/**/*.{css,js}',
    './src/_includes/*.njk',
    './src/_includes/**/*.njk',
  ],
  plugins: [forms, typography, tailwindcssDebugScreens],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
    debugScreens: {
      position: ['bottom', 'right'],
    },
    fontFamily: {
      sans: ['Recursive', ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono],
    },
    extend: {
      fontSize: {
        '10xl': [
          '10rem',
          {
            lineHeight: '1',
          },
        ],
        '12xl': [
          '12rem',
          {
            lineHeight: '1',
          },
        ],
        '14xl': [
          '14rem',
          {
            lineHeight: '1',
          },
        ],
        '16xl': [
          '16rem',
          {
            lineHeight: '1',
          },
        ],
        '18xl': [
          '18rem',
          {
            lineHeight: '1',
          },
        ],
        '20xl': [
          '20rem',
          {
            lineHeight: '1',
          },
        ],
        '22xl': [
          '22rem',
          {
            lineHeight: '1',
          },
        ],
      },
    },
  },
}
