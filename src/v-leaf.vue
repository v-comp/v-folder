<template>
  <li class="v-leaf" @click="notify('change')" :key="data.level">
    <i class="fa" :class="[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]"></i>
    {{data.name}}
  </li>
</template>

<script>
  export default {
    name: 'v-leaf',
    props: {
      data: {
        type: Object,
        required: true
      },
      uid: {
        type: [String, Number],
        required: true
      }
    }
  };
</script>
