<template>
  <ul class="branch">
    <v-node :data="node"></v-node>
    <v-branch v-show="node.open" v-for="branch in branches" :data="branch"></v-branch>
    <v-leaf
      v-show="node.open"
      v-for="leaf in leafs"
      :data="leaf"
    />
  </ul>
</template>

<script>
  import VLeaf from './v-leaf.vue';
  import VNode from './v-node.vue';

  export default {
    name: 'v-branch',
    props: {
      data: Object
    },
    components: {
      'v-node': VNode,
      'v-leaf': VLeaf
    },
    computed: {
      branches() {
        return this.data.branches;
      },
      leafs() {
        return this.data.leafs;
      },
      node() {
        return  this.data.node;
      }
    }
  };
</script>
