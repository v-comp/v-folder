<template lang="html">
  <ul class="v-branch-body">
    <v-node :data="node" :uid="uid"></v-node>
    <v-branch v-show="node.open" v-for="branch in branches" :data="branch" :uid="uid"></v-branch>
    <v-leaf v-show="node.open" v-for="leaf in leafs" :data="leaf" :uid="uid"></v-leaf>
  </ul>
</template>

<script>
  import eHubMixin from './mixin';
  import VNode from './v-node.vue';
  import VLeaf from './v-leaf.vue';
  import VBranch from './v-branch.vue';
  let i = 0;
  let pad = s => `${s}`.length < 4 ? `0000${s}`.slice(-4) : s;
  let uid = _ => pad(++i);

  export default {
    name: 'v-folder',
    mixins: [eHubMixin],
    props: {
      data: Object
    },
    components: {
      'v-node': VNode,
      'v-leaf': VLeaf,
      'v-branch': VBranch
    },
    data() {
      return {
        uid: uid()
      };
    },
    computed: {
      root() {
        return this.data;
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
    created() {
      this.listen('unfold', node => {
        this.$emit('unfold', node);
      });

      this.listen('change', node => {
        this.$emit('change', node);
      });
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


