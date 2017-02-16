import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

export default {
  entry: './src/index.js',
  dest: `dist/build.js`,
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  moduleName: 'VFolder',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    vue({
      css: 'dist/build.css',
      compileTemplate: false
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
