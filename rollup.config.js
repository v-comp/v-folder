import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'

import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'

const isDEV = process.env.NODE_ENV !== 'production'
export default {
  input: isDEV ? './src/demo.js' : './src/index.js',
  output: {
    strict: true,
    format: 'umd',
    sourcemap: true,
    name: 'VFolder',
    file: isDEV ? 'dist/demo.js' : 'dist/build.js'
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    postcss({
      plugins: [
        autoprefixer(),
        cssnano()
      ],
      extensions: ['.css']
    }),
    vue({
      compileTemplate: true
    }),
    commonjs(),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    buble({
      objectAssign: 'Object.assign'
    })
  ]
}
