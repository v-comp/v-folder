export default {
  methods: {
    notify(type) {
      if (process.env.ENV === 'prod') {
        console.info('[event type]:', type);
      }
      this.___vemit(type, this.data);
    },
    listen(type, fn) {
      this.___von(type, e => {
        fn(e);
      });
    }
  },
  destroyed() {
    this.___voff();
  }
};
