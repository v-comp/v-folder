<template>
  <li class="v-node" :key="data.level">
    <i
      class="fa"
      :class="[ data.canOpen && data.open ? 'fa-folder-open-o' : 'fa-folder-o' ]"
      @click="toggleExpanded"
    ></i>
    <span @click="toggleChecked">
      <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
      {{data.name}}
    </span>
  </li>
</template>

<script>
  import Mixin from './mixin';
  
  export default {
    props: {
      data: Object,
    },
    mixins: [Mixin],
    methods: {
      toggleChecked() {
        this.__EVENT_BUS.$emit('node_toggle_checked', this.data);
      },
      toggleExpanded() {
        this.__EVENT_BUS.$emit('node_toggle_expanded', this.data);
      }
    },
    created() {}
  };
</script>

<style scoped>
  .v-node {
    cursor: pointer;
  }
  .v-node .fa {
    width: 20px;
    color: #0d83e6;
    text-align: center;
  }
  .v-node .fa:hover {
    color: #0c71c5;
  }
</style>