<template>
  <ul class="v-branch-body">
    <v-node :data="node" :uid="uid"></v-node>
    <v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch>
    <v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf>
  </ul>
</template>
<script>
  import Store from './store';
  import EventMixin from './mixin';
  import VNode from './v-node.vue';
  import VLeaf from './v-leaf.vue';
  import VBranch from './v-branch.vue';
  let uid = 0;

  export default {
    name: 'v-folder',
    mixins: [EventMixin],
    props: {
      data: Object,
      ajax: Object,
      conf: Object
    },
    components: {
      'v-node': VNode,
      'v-leaf': VLeaf,
      'v-branch': VBranch
    },
    watch: {
      data(newVal, oldVal) {
        let nameKey = this.conf && this.conf.node || 'name';
        if (newVal[nameKey] !== oldVal[nameKey]) {
          this.store = new Store(newVal, this.conf);
        }
      }
    },
    data() {
      return {
        uid: uid++,
        store: new Store(this.data, this.conf)
      };
    },

    computed: {
      root() {
        return this.store.dataStore;
      },
      branches() {
        return this.root.branches;
      },
      leafs() {
        return this.root.leafs;
      },
      node() {
        return this.root.node;
      }
    },
    
    methods: {
      resTransform(data, node) {
        let conf = this.conf || {};
        let dirKey  = conf['branch'] || 'dirs';
        let fileKey = conf['leaf'] || 'files';
        let nameKey = conf['node'] || 'name';

        data[nameKey] = node.name;
        data[dirKey]  = data[dirKey].map(d => ({[nameKey]: d}));
        return data;
      },

      getReqConf(node) {
        let reqConf = this.ajax || {};
        let { url, method, data, params, pathAs, headers } = reqConf;

        if (method || method.toUpperCase() === 'GET') {
          reqConf.params = (params || {});
          reqConf.params[pathAs] = node.path;
        } else {
          reqConf.data = (data || {});
          reqConf.data[pathAs] = node.path;
        }

        reqConf.method = method || 'GET';
        reqConf.headers = headers || {};

        return reqConf;
      },

      request(node) {
        if (!this.ajax) {
          return Promise.reject('ajax:false');
        }

        let process = this.ajax.process || (res => res);

        return this.$http(this.getReqConf(node))
          .then(res => {
            let data = process(res.data);
            return this.resTransform(data, node);
          });
      }
    },

    created() {
      this.listen('change', node => {
        this.store.commit('change', node).then(res => this.$emit('change', res));
      });

      this.listen('unfold', node => {
        if (node.open && node.canOpen) {
          node.open =! node.open;
          return;
        }

        this.store.commit('unfold', node)
          .then(() => {

            this.request(node)
            .then(data => {
              if (data) {
                this.store.merge(data, node);
              } else {
                throw 'empty';
              }
            })
            .catch(e => {
              node.status = 'empty';
              window.console && console.error(e);
            });

          })
          .catch(e => node.status = 'done');

      });
    },
    destroyed () {
      this.distroy();
    }
  };
</script>

<style>
  /*----------------------------------------------------------------
                            .v-branch
  ---------------------------------------------------------------*/
  .v-branch-body {
    padding: 0;
    font-size: 16px;
    color: #666;
    list-style: none;
  }
  .v-branch-body > .v-branch {
    padding-left: 20px;
  }
  .v-branch > ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /*----------------------------------------------------------------
                            .v-node
  ---------------------------------------------------------------*/
  .v-node {
    padding: 0 0 0  20px;
  }

  .v-node .fa {
    width: 20px;
    color: #0d83e6;
    text-align: center;
  }
  .v-node .fa:hover {
    color: #0c71c5;
  }
  .v-node > .cursor-no-ops {
    cursor: not-allowed;
  }
  .v-node > .cursor-progress {
    cursor: progress;
  }

  /*----------------------------------------------------------------
                            .v-leaf
  ---------------------------------------------------------------*/
  .v-leaf {
    margin: 0 0 0 20px;
    padding: 0 0 0 20px;
  }
  .v-leaf .fa {
    display: inline-block;
    width: 20px;
    color: #0d83e6;
    text-align: center;
  }
  .v-leaf .fa:hover {
    color: #0c71c5;
  }


  /*----------------------------------------------------------------
                            common
  ---------------------------------------------------------------*/
  .v-node,
  .v-leaf {
    height: 1.5em;
    line-height: 1.5em;
    vertical-align: middle;
    overflow: hidden;
  }
  .v-node > .fa,
  .v-node > span > .fa,
  .v-leaf > .fa {
    float: left;
    width: 20px;
    height: 1.5em;
    line-height: 1.5em;
    cursor: pointer;
  }
  .v-node > span, 
  .v-leaf > span {
    float: left;
    cursor: pointer;
  }
</style>


