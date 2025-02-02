export default {
  plugins: {
    'tailwindcss/nesting': {},
    '@tailwindcss/postcss': {},
    'postcss-nested-ancestors': {},
    cssnano: {
      preset: 'default',
    },
  },
}
