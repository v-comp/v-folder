<template>
  <li class="v-leaf" @click="notify('LEAF_CHECK')" :key="data.level">
    <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
    {{data.name}}
  </li>
</template>

<script>
  import notifyMixin from './mixin.js';

  export default {
    props: {
      data: {
        type: Object,
        require: true
      },
      uid: {
        type: [Number, String],
        require: true
      }
    },
    mixins: [notifyMixin]
  };
</script>
