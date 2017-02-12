<template>
  <li class="v-node" :key="data.level">
    <i
      class="fa"
      :class="[ data.canOpen && data.open ? 'fa-folder-open-o' : 'fa-folder-o' ]"
      @click="notify('unfold')"
    ></i>
    <span @click="notify('change')">
      <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
      {{data.name}}
    </span>
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
