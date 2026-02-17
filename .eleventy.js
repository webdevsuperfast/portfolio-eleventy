import Image from '@11ty/eleventy-img'
import fs from 'fs'

export default function (config) {
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

    return Image.generateHTML(metadata, {
      sizes,
      alt,
      loading: 'lazy',
      decoding: 'async',
    })
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

    return metadata.webp[metadata.webp.length - 1].url
  }
  config.addNunjucksAsyncShortcode('portfolioImage', portfolioImageShortcode)

  async function testimonialImageShortcode(
    src,
    alt = '',
    widths = [50, null],
    sizes = ''
  ) {
    if (!src) return ''

    return await Image(src, {
      widths: widths,
      formats: ['webp'],
      urlPath: '/images/',
      outputDir: './dist/images/',
      returnType: 'html',
      htmlOptions: {
        imgAttributes: {
          alt,
          sizes,
          loading: 'lazy',
          decoding: 'async',
          class: 'testimonial-image rounded-full w-12 h-12 object-cover',
        },
      },
    })
  }
  config.addNunjucksAsyncShortcode(
    'testimonialImage',
    testimonialImageShortcode
  )

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
      includes: '_includes',
    },
    markdownTemplateEngine: 'njk',
  }
}
