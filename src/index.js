import VFolderComp from './index.vue';
import EventMixin from './mixin';
import { checkVersion, eventMix } from './install';

VFolderComp.install = Vue => {
  checkVersion(Vue)
  eventMix(Vue);
  Vue.mixin(EventMixin);
  Vue.component(VFolderComp.name, VFolderComp);
};
Vue.use(VFolderComp);


let DATA = {
  name: 'new folder',
  dirs: [{name: 'empty folder'}],
  files: ['1.js', '2.js']
};
let EMPTY = {
  name: 'empty',
  dirs: [],
  files: []
};

new Vue({
  el: '#app',
  template: `
    <div>
      <v-folder
        :uid="uid"
        :data="data"
        :ajax="ajax"
        @change="onChange"
        @request="onRequest"
      ></v-folder>
    </div>
  `,
  data() {
    return {
      uid: '23333',
      data: {
        name: '根目录',
        files: ['1.js', '2.js'],
        dirs: [{name: 'empty folder'}, {name: 'empty folder'}, {name: 'empty folder'}]
      },
      ajax: {}
    };
  },
  methods: {
    onChange(result) {
      console.log(result);
    },
    onRequest(node, done) {
      this.fetch(node).then(data => {
        done(data);
      });
    },
    fetch(node) {
      return new Promise(res => {
        setTimeout(() => res(Math.random() > .7 ? EMPTY : DATA), 5000);
      });
    }
  }
});
