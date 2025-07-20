import * as build from 'esbuild'
import path from 'path'
import { exec } from 'child_process'

const jsIn = path.resolve('src/_scripts/_main.js')
const jsOut = path.resolve('dist/assets/main.bundle.js')
const cssIn = path.resolve('src/_styles/_main.css')
const cssOut = path.resolve('dist/assets/main.bundle.css')
const isProduction = process.env.NODE_ENV === 'production'

function runTailwind({ watch = false, minify = false }) {
  let cmd = [
    'npx @tailwindcss/cli',
    `-i ${cssIn}`,
    `-o ${cssOut}`,
    '--postcss',
    watch ? '--watch' : '',
    minify ? '--minify' : '',
  ].filter(Boolean).join(' ')
  const proc = exec(cmd)
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
  return proc
}

async function buildAll() {
  try {
    let ctx = await build.context({
      entryPoints: [jsIn],
      outfile: jsOut,
      minify: isProduction,
      bundle: true,
    })

    if (!isProduction) {
      await ctx.watch()
      runTailwind({ watch: true })
    } else {
      await ctx.rebuild()
      await ctx.dispose()
      runTailwind({ minify: true })
      console.log('Built for production and disposed context.')
    }
  } catch (error) {
    console.error('An error occurred during the build process:', error)
  }
}

buildAll()
