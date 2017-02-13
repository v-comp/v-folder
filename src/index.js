import VFolderComp from './index.vue';
import { checkVersion, eventMix } from './install';

VFolderComp.install = Vue => {
  checkVersion(Vue)
  eventMix(Vue);
  Vue.component(VFolderComp.name, VFolderComp);
};

export default VFolderComp;
