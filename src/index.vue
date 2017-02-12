<template lang="html">
  <ul class="branch">
    <v-node :data="node"></v-node>
    <v-branch v-show="node.open" v-for="branch in branches" :data="branch"></v-branch>
    <v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf"></v-leaf>
  </ul>
</template>

<script>
  import Store from './store';
  import VNode from './v-node.vue';
  import VLeaf from './v-leaf.vue';
  import VBranch from './v-branch.vue';

  export default {
    name: 'v-tree-select',
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
      this.__EVENT_BUS.$on('node_toggle_expanded', node => {
        node.open = !node.open;
      });

      this.__EVENT_BUS.$on('node_toggle_checked', node => {
        let branch = this.store.findCurrentBranch(node.level);
        let level  = branch.level;
        let nextState = !branch.node.checked;
        
        branch.node.checked = nextState;
        branch.branches.forEach(b => b.node.checked = nextState);
        branch.leafs.forEach(l => l.checked = nextState);

        this.store.checkAscendents(level, nextState);
        this.__EVENT_BUS.$emit('descendents_force_checked', branch.level, nextState);

        this.$nextTick(() => {
          this.$emit('change', this.store.getPathResult());
        });
      });

      this.__EVENT_BUS.$on('leaf_toggle_checked', leaf => {
        let nextState = !leaf.checked;
        leaf.checked = nextState;
        this.store.checkAscendents(leaf.level, nextState);
        
        this.$nextTick(() => {
          this.$emit('change', this.store.getPathResult());
        });
      });
    }
  };
</script>

<style>
  .branch {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    color: #666;
    font-size: 18px;
  }
  .branch > .branch {
    margin-left: 27px;
  }
</style>


