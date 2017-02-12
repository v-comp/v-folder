<template>
  <v-tree :store="store" @change="change" @request="request" :uid="uid"></v-tree>
</template>
<script>
  let KEY_MAP = {};
  import Store from './store';
  import VTree from './v-tree.vue';

  export default {
    name: 'v-folder',
    props: {
      data: Object,
      uid: {
        type: [String, Number],
        required: true
      }
    },
    components: {
      'v-tree': VTree
    },
    data() {
      return {
        store: new Store(this.data)
      };
    },
    methods: {
      change(result) {
        this.$emit('change', result);
      },
      request(node, done) {
        this.$emit('request', node, done);
      }
    },
    created() {
      let uid = this.uid;
      if (uid in KEY_MAP) {
        throw 'each <v-folder> instance must get an unique `uid` property';
      } else {
        KEY_MAP[uid] = null;
      }
    }
  };
</script>
