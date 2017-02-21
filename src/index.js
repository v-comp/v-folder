import VFolderComp from './index.vue';
import { eventMix } from './install';

VFolderComp.install = Vue => {
  let [mj, mi, pa] = Vue.version.split('.');
  
  let versionOk = mj > 2 || +mj === 2 && (mi > 1 || +mi === 1 && pa >= 5);
  if (!versionOk) {
    throw 'You should at least get Vue.js@2.1.5.'
  }

  eventMix(Vue);
  Vue.component(VFolderComp.name, VFolderComp);
};

export default VFolderComp;
