import * as build from 'esbuild'
import { tailwindPlugin } from 'esbuild-plugin-tailwindcss'
import path from 'path'

const jsIn = path.resolve('src/_scripts/_main.js')
const jsOut = path.resolve('dist/assets/main.bundle.js')

const cssIn = path.resolve('src/_styles/main.scss')
const cssOut = path.resolve('dist/assets/main.bundle.css')

const isProduction = process.env.NODE_ENV === 'production'

async function buildProcess(config, isProduction, watchMessage, buildMessage) {
  try {
    let ctx = isProduction
      ? await build.build(config) // This is for production build
      : await build.context(config) // This is for watch mode

    if (!isProduction) {
      // In watch mode, listen for changes
      await ctx.watch()
      console.log(watchMessage)
    } else {
      // If production, no need to call rebuild(), ctx should already handle it.
      console.log(buildMessage)
    }
  } catch (error) {
    console.error('An error occurred during the build process:', error)
  }
}

async function cssBuild() {
  const cssConfig = {
    entryPoints: [cssIn],
    outfile: cssOut,
    plugins: [tailwindPlugin()],
  }

  await buildProcess(
    cssConfig,
    isProduction,
    'Watching for changes in the styles directory.',
    'Built CSS for production.'
  )
}

async function jsBuild() {
  const jsConfig = {
    entryPoints: [jsIn],
    outfile: jsOut,
    minify: isProduction,
    bundle: true,
  }

  await buildProcess(
    jsConfig,
    isProduction,
    'Watching for changes in the scripts directory.',
    'Built JS for production.'
  )
}

// Wrap builds in an async function
async function buildAll() {
  await jsBuild()
  await cssBuild()
}

buildAll()
