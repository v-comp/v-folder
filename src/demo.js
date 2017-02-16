import VFolderComp from './index';
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
        sourceDir: /Windows/i.test(navigator.userAgent) ? 'C:/Users' : '/Users',
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