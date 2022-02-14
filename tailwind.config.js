module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,md,njk,svg}'],
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
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
        'barlow-condensed': ['Barlow Condensed', 'sans-serif'],
      },
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
      backgroundImage: {
        light: 'url(../images/background-light.jpg)',
        dark: 'url(../images/background-dark.jpg)',
      },
    },
  },
}
