<template>
<ul class="branch">
  <li class="node" @click="toggleNode(data)">
    <i class="fa" :class="{
      'fa-folder': !nodeExpanded,
      'fa-folder-open': nodeExpanded
    }"></i>
    {{nodeName}}
  </li> 

  <v-tree-select
    v-show="nodeExpanded"
    v-for="branch in branches"
    :data="branch"
    :conf="conf"
  ></v-tree-select> 


  <li v-show="nodeExpanded" v-for="leaf in leaves" class="leaf">
    {{leaf}}
  </li>
</ul>
</template>

<script>
  export default {
    name: 'vTreeSelect',
    props: {
      data: Object,
      conf: Object
    },
    data() {
      return {
        nodeExpanded: false
      };
    },
    computed: {
      branches() {
        return this.data[this.conf.branch];
      },
      leaves() {
        return this.data[this.conf.leaf];
      },
      nodeName() {
        return this.data[this.conf.node];
      }
    },
    methods: {
      toggleNode(data) {
        this.nodeExpanded = !this.nodeExpanded;
      }
    },
    created() {
      console.log(this.conf.node);
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
  }
  .node {
    cursor: pointer;
  }
  .node > .fa {
    color: #0d83e6;
  }
  .leaf {
    margin-left: 15px;
    cursor: pointer;
  }

  .branch > .branch {
    margin-left: 15px;
  }
</style>
