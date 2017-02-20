# v-folder

A component made for  vue@2, for tree/directory/files selection or displaying. 

## Note

**Vue version above 2.1.5 is required.**

## Install

```bash
# npm
npm install --save v-folder

# or yarn
yarn add v-folder
```

**Note that [font-awsome](http://fontawesome.io) is required.**

## Demo

You can run `npm run dev` for local preview.

For project integration, see configurations bellow:

```javascript

import VFolder from 'v-folder';
Vue.use(VFolder);

new Vue({
  el: '#app',
  template: `
      <v-folder :data="data" :ajax="ajax" :conf="conf" @change="onChange"></v-folder>
  `,
  data() {
    return {
      uid: 0,
      conf: {
        // tree node name
        node: 'sourceDir',
        // KEY NAME of dirs/branches/parents etc.. .
        branch: 'dirs',
        // KEY NAME of  files/leafs/children etc...
        leaf: 'files'
      },
      data: {
        // root
        sourceDir: 'C:/Users',
        // children
        files: [],
        dirs: []
      },
      // ajax settings
      ajax: {
        method: 'GET',
        url: 'http://localhost:1234',
        params: {},
        data: {},
        headers: {},
        // params key of path
        pathAs: 'path',
        // process response data
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

```

## Screenshot

![](https://p2.ssl.qhimg.com/t01ce62550057a38251.png)

