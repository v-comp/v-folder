<template>
  <ul class="v-branch-body">
    <v-node :data="node" :uid="uid"></v-node>
    <v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch>
    <v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf>
  </ul>
</template>
<script>
  let KEY_MAP = {};
  import Store from './store';
  import EventMixin from './mixin';
  import VNode from './v-node.vue';
  import VLeaf from './v-leaf.vue';
  import VBranch from './v-branch.vue';

  export default {
    name: 'v-folder',
    mixins: [EventMixin],
    props: {
      data: Object,
      uid: {
        type: [String, Number],
        required: true
      },
      ajax: Object,
      conf: Object
    },
    components: {
      'v-node': VNode,
      'v-leaf': VLeaf,
      'v-branch': VBranch
    },
    data() {
      return {
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
      request(node, done) {
        if (!this.ajax) {
          return done('ajax:false');
        }
        
        let conf = this.conf || {};
        let dirKey  = conf['branch'] || 'dirs';
        let fileKey = conf['leaf'] || 'files';
        let nameKey = conf['node'] || 'name';
  
        let reqConf = this.ajax;
        let { url, method, data, params, pathAs, headers } = reqConf;
        let isGET = method.toUpperCase() === 'GET';
        
        if (isGET) {
          reqConf.params = (params || {});
          reqConf.params[pathAs] = node.path;
        } else {
          reqConf.data = (data || {});
          reqConf.data[pathAs] = node.path;
        }

        reqConf.headers = headers || {};

        this.$http(reqConf)
          .then(r => r.data)
          .then(data => {
            data[nameKey] = node.name;
            data[dirKey]  = data[dirKey].map(d => ({[nameKey]: d}));
            done(null, data);
          })
          .catch(e => done(e));
      }
    },
    created() {
      let uid = this.uid;
      if (uid in KEY_MAP) {
        throw 'each <v-folder> instance must get an unique `uid` property';
      } else {
        KEY_MAP[uid] = null;
      }

      this.listen('change', node => {
        this.store.commit('change', node, (res) => this.$emit('change', res));
      });

      this.listen('unfold', node => {
        this.store.commit('fold', node, () => {
          node.status = 'loading';
  
          this.request(node, (err, data) => {
            if (err) {
              node.status = 'empty';
            } else {
              this.store.merge(data, node);
            }
          });
        });
      });
    }
  };
</script>

<style scoped>
  /*----------------------------------------------------------------
                            .v-branch
  ---------------------------------------------------------------*/
  .v-branch-body {
    padding: 0;
    font-size: 18px;
    color: #666;
    list-style: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
  }
  .v-branch-body .v-branch {
    padding-left: 27px;
  }
  .v-branch ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /*----------------------------------------------------------------
                            .v-node
  ---------------------------------------------------------------*/
  .v-node {
    padding: 0 0 0  27px;
    list-style: none;
    overflow: hidden;
    cursor: pointer;
    vertical-align: middle;
  }
  .v-node .fa {
    width: 20px;
    color: #0d83e6;
    text-align: center;
  }
  .v-node .fa:hover {
    color: #0c71c5;
  }

  /*----------------------------------------------------------------
                            .v-leaf
  ---------------------------------------------------------------*/
  .v-leaf {
    margin: 0 0 0 27px;
    padding: 0 0 0 27px;
    cursor: pointer;
    vertical-align: middle;
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

  .cursor-no-ops {
    cursor: not-allowed;
  }
  .cursor-progress {
    cursor: progress;
  }
</style>


