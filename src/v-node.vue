<template>
  <li class="v-node" :key="data.level">
    <i
      class="fa"
      :class="[ data.canOpen && data.open ? 'fa-folder-open-o' : 'fa-folder-o' ]"
      @click="notify('NODE_OPEN')"
    ></i>
    <span @click="notify('NODE_CHECK')">
      <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
      {{data.name}}
    </span>
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
