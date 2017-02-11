import VTreeComponent from './index.vue';
import VBranchComponent from './v-branch.vue';

VTreeComponent.install = Vue => {
  // inject a eventbus
  Vue.prototype.__EVENT_BUS = new Vue();
  Vue.use(VBranchComponent);
  Vue.component(VTreeComponent.name, VTreeComponent);
};
VBranchComponent.install = Vue => {
  Vue.component(VBranchComponent.name, VBranchComponent);
};

export default VTreeComponent;
