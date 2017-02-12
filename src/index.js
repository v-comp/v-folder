import VFolderComp from './index.vue';
import { checkVersion, eventMix } from './install';

VFolderComp.install = Vue => {
  checkVersion(Vue)
  eventMix(Vue);
  Vue.component(VFolderComp.name, VFolderComp);
};
Vue.use(VFolderComp);

import Store from './store';
import deepClone from 'clone';


let NEW_FOLDER = {
  name: 'new folder',
  dirs: [{name: 'empty folder'}],
  files: ['1.js', '2.js']
};

new Vue({
  el: '#app',
  template: '<v-folder :data="data" @change="change" @unfold="unfold"></v-folder>',
  data: {
    store: new Store(NEW_FOLDER)
  },
  computed: {
    data() {
      return this.store.dataStore;
    }
  },
  methods: {
    change(elem) {
      this.store.commit('change', elem, result => {
        console.log(result);
      });
    },
    unfold(elem) {
      this.store.commit('fold', elem, _ => {
        setTimeout(() => {
          // TODO
          // 根节点空
          // 则不会有任何效果
          this.store.merge(NEW_FOLDER, elem);
        }, 200);
      });
    }
  },
  created() {
    // this.store.merge({
    //   name: 22,
    //   files: [1, 2, 4],
    //   dirs: []
    // });
  }
});
