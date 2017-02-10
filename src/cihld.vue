<template>
<ul>
  <li>{{nodeName}}</li>
  <li v-for="branch in branches" class="branch">
    {{branch}}
  </li> 

  <li v-for="leaf in leaves" class="leaf">
    {{leaf}}
  </li>
</ul>
</template>

<script>
  export default {
    props: {
      data: Object,
      conf: Object
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
    created() {
      console.log(this.data);
    }
  };
</script>

<style>
  .branch {
    color: red;
  }
  .leaf {
    color: lightseagreen;
  }
</style>
