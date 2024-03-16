module.exports = (config) => {
  const Image = require('@11ty/eleventy-img')

  const fs = require('fs')

  config.addPassthroughCopy({ public: './' })

  config.addPassthroughCopy({ 'src/robots.txt': '/robots.txt' })

  config.addFilter('criticalExists', () => {
    return fs.existsSync('./critical.min.css')
  })

  config.addFilter('getCritical', () => {
    return fs.readFileSync('./critical.min.css')
  })

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

  async function portfolioImageShortcode(src, alt) {
    let metadata = await Image(src, {
      widths: [null],
      formats: ['webp'],
      urlPath: '/images/',
      outputDir: './dist/images/',
    })

    let imageAttributes = {
      alt,
      loading: 'lazy',
      decoding: 'async',
    }

    let data = metadata.webp[metadata.webp.length - 1]

    return data.url
  }

  config.addNunjucksAsyncShortcode('portfolioImage', portfolioImageShortcode)

  config.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  })
  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    markdownTemplateEngine: 'njk',
  }
}
