export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-nested-ancestors': {},
    cssnano: {
      preset: 'default',
    },
  },
}
