import VFolderComp from './index.vue';
import { checkVersion, eventMix } from './install';

VFolderComp.install = Vue => {
  checkVersion(Vue)
  eventMix(Vue);
  Vue.component(VFolderComp.name, VFolderComp);
};
Vue.use(VFolderComp);


let DATA = {
  name: 'new folder',
  dirs: [{name: 'empty folder'}],
  files: ['1.js', '2.js']
};

new Vue({
  el: '#app',
  template: `
    <div>
      <v-folder
        :uid="uid"
        :data="data"
        :ajax="ajax"
        :conf="conf"
        @change="onChange"
      ></v-folder>
    </div>
  `,
  data() {
    return {
      uid: 0,
      conf: {
        node: 'name',
        branch: 'dirs',
        leaf: 'files',
        open: false,
        checked: false
      },
      data: {
        name: '/Users/',
        files: [],
        dirs: []
      },
      ajax: {
        url: 'http://localhost:1234',
        params: {},
        method: 'GET',
        headers: {},
        pathAs: 'path'
      }
    };
  },
  methods: {
    onChange(result) {
      console.log(result);
    }
  }
});
