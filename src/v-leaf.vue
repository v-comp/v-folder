<template>
  <li class="v-leaf" @click="notify('change')" :key="data.level">
    <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
    {{data.name}}
  </li>
</template>

<script>
  import eHubMixin from './mixin';

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
    mixins: [eHubMixin]
  };
</script>
