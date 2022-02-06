module.exports = {
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
        'ibm-plex-sans': ['IBM Plex Sans', 'sans-serif']
      },
      fontSize: {
        '14xl': ['14rem', {
          lineHeight: '1'
        }],
        '16xl': ['16rem', {
          lineHeight: '1'
        }]
      },
      backgroundImage: {
        body: 'url(../images/background.jpg)'
      }
    },
  },
}
