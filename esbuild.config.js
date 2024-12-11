import * as build from 'esbuild'
import path from 'path'

const jsIn = path.resolve('src/_scripts/_main.js')
const jsOut = path.resolve('dist/assets/main.bundle.js')

const isProduction = process.env.NODE_ENV === 'production'

try {
  let ctx = await build.context({
    entryPoints: [jsIn],
    outfile: jsOut,
    minify: isProduction,
    bundle: true,
  })

  if (!isProduction) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
    console.log('Built for production and disposed context.')
  }
} catch (error) {
  console.error('An error occurred during the build process:', error)
}
