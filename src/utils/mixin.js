export default {
  methods: {
    notify (type) {
      this.$announce(type, this.data)
    },
    listen (type, fn) {
      this.$listen(type, e => {
        fn(e)
      })
    },
    distroy () {
      this.$hangup()
    }
  }
}
