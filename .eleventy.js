module.exports = (config) => {
  const Image = require('@11ty/eleventy-img');

  config.addPassthroughCopy({ 'public': './' })
  
  async function imageShortcode( src, alt, sizes ) {
    let metadata = await Image( src, {
      widths: [445, null],
      formats: ['webp', 'jpg'],
      urlPath: '/images/',
      outputDir: './dist/images/',
    } );

    let imageAttributes = {
      sizes,
      alt,
      loading: 'lazy',
      decoding: 'async',
    }
    
    return Image.generateHTML( metadata, imageAttributes );
  }

  config.addNunjucksAsyncShortcode('image', imageShortcode);

  async function portfolioImageShortcode( src, alt ) {
    let metadata = await Image( src, {
      widths: [1024],
      formats: ['webp'],
      urlPath: '/images/',
      outputDir: './dist/images/',
    } );

    let imageAttributes = {
      alt,
      loading: 'lazy',
      decoding: 'async',
    }

    let data = metadata.webp[metadata.webp.length - 1];

    return `<a href="${data.url}" class="portfolio-image">` + Image.generateHTML( metadata, imageAttributes ) + `</a>`;
  }

  config.addNunjucksAsyncShortcode('portfolio-image', portfolioImageShortcode);

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
