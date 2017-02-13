<template>
  <li class="v-node" :key="data.level">
    <i
      class="fa"
      :class="icon"
      @click="notify('unfold')"
    ></i>
    <span @click="notify('change')">
      <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
      {{data.name}}
    </span>
  </li>
</template>

<script>
  import EventMixin from './mixin';
  export default {
    name: 'v-node',
    mixins: [EventMixin],
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
    computed: {
      icon() {
        let data = this.data;
        let folderLoding = data.status === 'loading';
        let folderOpen = data.canOpen && data.open;
        let isEmpty = !data.canOpen && data.status === 'done';
        return {
          'fa-spinner cursor-progress': folderLoding,
          'fa-folder-open-o': !folderLoding && folderOpen,
          'fa-folder-o': !folderLoding && !folderOpen,
          'cursor-no-ops': isEmpty
        };
      }
    }
  };
</script>
