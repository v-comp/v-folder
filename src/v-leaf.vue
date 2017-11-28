<template>
  <li class="v-leaf" @click="notify('change')" :key="data.level">
    <i class="fa" :class="className"></i><span>{{data.name}}</span>
  </li>
</template>

<script>
  import EventMixin from './mixin'

  const classNames = [
    'fa-square-o',
    'fa-minus-square-o',
    'fa-check-square-o',
  ]

  export default {
    name: 'v-leaf',
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
      className() {
        return classNames[this.data.check + 1]
      }
    }
  }
</script>
