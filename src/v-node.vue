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
  export default {
    name: 'v-node',
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
        return {
          'fa-spinner': folderLoding,
          'fa-folder-open-o': !folderLoding && folderOpen,
          'fa-folder-o': !folderLoding && !folderOpen
        };
      }
    }
  };
</script>
