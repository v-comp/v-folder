# v-folder

A folder select vue@2 component.

```javascript
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
        name: 'C:/Users/',
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
```