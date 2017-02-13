import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

let { MODE, ENV } = process.env;

export default {
  entry: './src/index.js',
  dest: `dist/bundle.${MODE}.js`,
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  moduleName: 'VFolder',
  plugins: [
    replace({
      'process.env.MODE': JSON.stringify(MODE),
      'process.env.ENV': JSON.stringify(ENV)
    }),
    vue({
      css: `dist/bundle.css`,
      compileTemplate: process.env.MODE === 'compile'
    }),
    commonjs(),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    buble({
      objectAssign: 'Object.assign'
    }),
    uglify()
  ]
};
