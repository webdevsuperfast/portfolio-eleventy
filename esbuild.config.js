import { build } from 'esbuild'
import path from 'path'

const jsIn = path.resolve('src/_scripts/_main.js')
const jsOut = path.resolve('dist/assets/main.bundle.js')

const isProduction = process.env.NODE_ENV === 'production'

build({
  entryPoints: [jsIn],
  outfile: jsOut,
  minify: isProduction,
  bundle: true,
  watch: !isProduction,
}).catch(() => process.exit(1))
