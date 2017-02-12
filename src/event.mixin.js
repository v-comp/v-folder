module.exports = {
  methods: {
    notify(type) {
      this.$vemit(type, this.data);
    }
  }
};
