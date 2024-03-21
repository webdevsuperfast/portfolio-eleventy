const Image = require('@11ty/eleventy-img')
const fs = require('fs')

module.exports = function (config) {
  // Add passthrough copies
  config.addPassthroughCopy({ public: './' })
  config.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' })

  // Add filters
  config.addFilter('criticalExists', () => fs.existsSync('./critical.min.css'))
  config.addFilter('getCritical', () => fs.readFileSync('./critical.min.css'))

  // Image shortcode
  async function imageShortcode(src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [445, null],
      formats: ['webp', 'jpg'],
      urlPath: '/images/',
      outputDir: './dist/images/',
    })

    let imageAttributes = {
      sizes,
      alt,
      loading: 'lazy',
      decoding: 'async',
    }

    return Image.generateHTML(metadata, imageAttributes)
  }
  config.addNunjucksAsyncShortcode('image', imageShortcode)

  // Portfolio image shortcode
  async function portfolioImageShortcode(src, alt) {
    let metadata = await Image(src, {
      widths: [null],
      formats: ['webp'],
      urlPath: '/images/',
      outputDir: './dist/images/',
    })

    let data = metadata.webp[metadata.webp.length - 1]

    return data.url
  }
  config.addNunjucksAsyncShortcode('portfolioImage', portfolioImageShortcode)

  // Set BrowserSync config
  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  })

  // Set directory configuration
  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
  }
}
