import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: 'index.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  sourceMap: true,
  useStrict: true,
  moduleName: 'vTreeSelect',
  plugins: [
    vue({
      compileTemplate: false
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
