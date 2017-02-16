import VFolderComp from './index.vue';
import { eventMix } from './install';

VFolderComp.install = Vue => {
  let [mj, mi, pa] = Vue.version.split('.');
  
  if (mj > 2 || mj === 2 && (mi > 1 || mi === 1 && pa >= 5)) {
    throw 'You should at least get Vue.js@2.1.5.'
  }

  eventMix(Vue);
  Vue.component(VFolderComp.name, VFolderComp);
};

export default VFolderComp;

if (process.env.NODE_ENV !== 'production') {
  window.Vue.use(VFolderComp);
  new Vue({
    el: '#app',
    template: `
      <div>
        <v-folder
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
          node: 'sourceDir',
          branch: 'dirs',
          leaf: 'files',
          open: false,
          checked: false
        },
        data: {
          sourceDir: 'C:/Users',
          files: [],
          dirs: []
        },
        ajax: {
          method: 'GET',
          url: 'http://localhost:1234',
          params: {},
          data: {},
          headers: {},
          pathAs: 'path',
          process: (res) => res.data
        }
      };
    },
    methods: {
      onChange(result) {
        console.log(result);
      }
    }
  });
}
