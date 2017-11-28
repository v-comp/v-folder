import VFolderComp from './index'

const Vue = window.Vue
Vue.use(VFolderComp)

let data = {
  sourceDir: 'root',
  dirs: [{
    sourceDir: 'subroot-1',
    dirs: ['empty 1', 'empty 2', 'empty 3'],
    files: ['file1234', 'file5678', 'filexyzw']
  }, {
    sourceDir: 'subroot-2',
    dirs: ['empty 1', 'empty 2', 'empty 3'],
    files: ['file1234', 'file5678', 'filexyzw']
  }, {
    sourceDir: 'subroot-3',
    dirs: ['empty 1', 'empty 2', 'empty 3'],
    files: ['file1234', 'file5678', 'filexyzw']
  }],
  files: ['a.js', 'b.js', 'c.js']
}

let vm = new Vue({
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
  data () {
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
    }
  },
  methods: {
    onChange (result) {
      console.log(result)
    }
  }
})

if (!/localhost/.test(window.location.href)) {
  vm.data = data
}
