import VFolderComp from './index.vue';
import compareVersion from 'compare-versions';
const compare = (v1, v2) => compareVersion(v1, v2) >= 0;

VFolderComp.install = Vue => {
  // if must compile template
  if (procee.env.MODE === 'compile') {
    // `compileTemplate: true` will error
    // before version 2.1.5
    if (!compare(Vue.version, '2.1.5')) {
      throw 'Vue before verison 2.1.5 will cause error.\n Pleasw consider updating vue, or just require `bundle.common.js` instead of `bundle.compile.js`';
    }
  }

  // warn that will not support vue@1
  if (!compare(Vue.version, '2.0.0')) {
    throw 'This module can only supports vue@2!';
  }

  // inject a eventbus
  Vue.prototype.__EVENT_BUS = new Vue();
  Vue.component(VFolderComp.name, VFolderComp);
};

export default VFolderComp;
