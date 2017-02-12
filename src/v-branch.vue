<template>
  <li :key="node.level" class="v-branch">
    <ul class="v-branch-body">
      <v-node :data="node" :uid="uid"></v-node>
      <v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch>
      <v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf>
    </ul>
  </li>
</template>

<script>
  import VLeaf from './v-leaf.vue';
  import VNode from './v-node.vue';

  export default {
    name: 'v-branch',
    props: {
      data: {
        type: Object,
        required: true
      },
      uid: {
        type: [String, Number],
        required: true
      }
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
