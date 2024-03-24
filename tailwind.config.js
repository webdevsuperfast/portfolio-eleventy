const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,css,md,njk,svg}'],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-debug-screens'),
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
    },
    debugScreens: {
      position: ['bottom', 'right'],
    },
    fontFamily: {
      sans: ['MiSansLatin', ...defaultTheme.fontFamily.sans],
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
