const compare = require('compare-versions');

try {
  if (compare(require('vue').version, '2.1.5') >= 0) {
    module.exports = require('./dist/bundle.compile');
    module.exports.mode = 'compiled';
    return;
  }
} catch (e) {}

console.warn('[v-folder] vue before version 2.1.5 will not use compiled version!');
module.exports = require('./dist/bundle.common');
module.exports.mode = 'common';
