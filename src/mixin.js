export default {
  methods: {
    notify (type) {
      this.___vemit(type, this.data)
    },
    listen (type, fn) {
      this.___von(type, e => {
        fn(e)
      })
    },
    distroy () {
      this.___voff()
    }
  }
}
