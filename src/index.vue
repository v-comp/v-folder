<template lang="html">
  <ul class="v-branch-body">
    <v-node :data="node" :uid="uid"></v-node>
    <v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch>
    <v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf>
  </ul>
</template>

<script>
  import Store from './store';
  import VNode from './v-node.vue';
  import VLeaf from './v-leaf.vue';
  import VBranch from './v-branch.vue';
  let uid = 2333;

  export default {
    name: 'v-folder',
    props: {
      data: Object,
      conf: Object
    },
    components: {
      'v-node': VNode,
      'v-leaf': VLeaf,
      'v-branch': VBranch
    },
    data() {
      let store = new Store(this.data, this.conf);

      return {
        uid: uid++,
        store,
        root: store.dataStore
      };
    },
    computed: {
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
    created() {
      this.$von('NODE_OPEN', node => {
        this.store.expandNode(node);
      });

      this.$von('NODE_CHECK', node => {
        this.store.checkNode(node);
        this.$vemit('change', this.store.getPathResult());
      });

      this.$von('LEAF_CHECK', leaf => {
        this.store.checkLeaf(leaf);
        this.$emit('change', this.store.getPathResult());
      });
    },
    destroyed () {
      this.$voff();
    }
  };
</script>

<style>
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
    margin-left: 27px;
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
    padding: 0;
    cursor: pointer;
    list-style: none;
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
    padding: 0;
    margin: 0 0 0 27px;
    cursor: pointer;
  }
  .v-leaf .fa {
    display: inline-block;
    width: 20px;
    color: #0d83e6;
    text-align: center;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
  }
  .v-leaf .fa:hover {
    color: #0c71c5;
  }
</style>


