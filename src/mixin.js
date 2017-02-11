module.exports = {
  created() {
    /**
     * when the branch is checked/unchecked
     * all descendents should be checked/unchecked too
     */
    this.__EVENT_BUS.$on('descendents_force_checked', (level, checked) => {
      let lvId = this.data.level;

      if (
        lvId.indexOf(level) === 0
        && lvId.slice(level.length).length > 0
      ) {
        this.data.checked = checked;
      }
    });


  }
};
