<template>
  <li class="v-leaf" @click="toggleChecked">
    <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
    {{data.name}}
  </li>
</template>

<script>
  import Mixin from './mixin';

  export default {
    props: {
      data: Object
    },
    mixins: [Mixin],
    methods: {
      toggleChecked() {
        this.__EVENT_BUS.$emit('leaf_toggle_checked', this.data);
      }
    },
    created() {}
  };
</script>

<style lang="css">
  .v-leaf {
    margin-left: 27px;
    cursor: pointer;
  }
  .v-leaf .fa {
    width: 20px;
    color: #0d83e6;
    text-align: center;
  }
  .v-leaf .fa:hover {
    color: #0c71c5;
  }
</style>