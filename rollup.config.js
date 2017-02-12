import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

let MODE = process.env.MODE;

export default {
  entry: './src/index.js',
  dest: `dist/bundle.${MODE}.js`,
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  moduleName: 'vFolder',
  plugins: [
    replace({
      'procee.env.MODE': JSON.stringify(MODE)
    }),
    commonjs(),
    vue({
      css: `dist/bundle.css`,
      compileTemplate: process.env.MODE === 'compile'
    }),
    buble({
      objectAssign: 'Object.assign'
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    uglify()
  ]
};
