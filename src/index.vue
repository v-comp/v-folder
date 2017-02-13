<template>
  <v-tree :store="store" :uid="uid"></v-tree>
</template>
<script>
  let KEY_MAP = {};
  import EventMixin from './mixin';
  import Store from './store';
  import VTree from './v-tree.vue';

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
      'v-tree': VTree
    },
    data() {
      return {
        store: new Store(this.data, this.conf)
      };
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
        let { url, method, data, params, pathAs } = reqConf;
        let isGET = method.toUpperCase() === 'GET';
        
        if (isGET) {
          reqConf.params = (params || {});
          reqConf.params[pathAs] = node.path;
        } else {
          reqConf.data = (data || {});
          reqConf.data[pathAs] = node.path;
        }

        this.$http(reqConf).then(res => {
          let data = res.data;
          data[dirKey] = data[dirKey].map(d => ({[nameKey]: d}));
          done(null, data);
        })
        .catch(e => {
          done(e);
        });
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
        this.store.commit('change', node, result => {
          this.$emit('change', result);
        });
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
