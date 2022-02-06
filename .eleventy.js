module.exports = (config) => {
  const Image = require('@11ty/eleventy-img');

  config.addPassthroughCopy({ 'public': './' })
  
  async function imageShortcode( src, alt, sizes ) {
    let metadata = await Image( src, {
      widths: [445, 800],
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
