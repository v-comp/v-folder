(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VFolder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var inserted = exports.cache = {}

function noop () {}

exports.insert = function (css) {
  if (inserted[css]) return noop
  inserted[css] = true

  var elem = document.createElement('style')
  elem.setAttribute('type', 'text/css')

  if ('textContent' in elem) {
    elem.textContent = css
  } else {
    elem.styleSheet.cssText = css
  }

  document.getElementsByTagName('head')[0].appendChild(elem)
  return function () {
    document.getElementsByTagName('head')[0].removeChild(elem)
    inserted[css] = false
  }
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = require('./index.vue');

var _index2 = _interopRequireDefault(_index);

var _install = require('./install');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.install = function (Vue) {
  var _Vue$version$split = Vue.version.split('.'),
      _Vue$version$split2 = _slicedToArray(_Vue$version$split, 3),
      mj = _Vue$version$split2[0],
      mi = _Vue$version$split2[1],
      pa = _Vue$version$split2[2];

  if (mj > 2 || mj === 2 && (mi > 1 || mi === 1 && pa >= 5)) {
    throw 'You should at least get Vue.js@2.1.5.';
  }

  (0, _install.eventMix)(Vue);
  Vue.component(_index2.default.name, _index2.default);
};

exports.default = _index2.default;

},{"./index.vue":3,"./install":4}],3:[function(require,module,exports){
var __vueify_style_dispose__ = require("vueify/lib/insert-css").insert(".v-branch-body{padding:0;font-size:16px;color:#666;list-style:none}.v-branch-body>.v-branch{padding-left:20px}.v-branch>ul{margin:0;padding:0;list-style:none}.v-leaf,.v-node{height:1.5em;line-height:1.5em;padding:0 0 0 20px;vertical-align:middle;overflow:hidden}.v-leaf{margin:0 0 0 20px}.v-leaf>.fa,.v-node>.fa,.v-node>span>.fa{float:left;width:20px;height:1.5em;line-height:1.5em;color:#0d83e6;text-align:center;cursor:pointer}.v-leaf>span,.v-node>span{float:left;cursor:pointer}.v-leaf .fa:hover,.v-node .fa:hover{color:#0c71c5}.v-node>.cursor-no-ops{cursor:not-allowed}.v-node>.cursor-progress{cursor:progress}")
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _mixin = require('./mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _vNode = require('./v-node.vue');

var _vNode2 = _interopRequireDefault(_vNode);

var _vLeaf = require('./v-leaf.vue');

var _vLeaf2 = _interopRequireDefault(_vLeaf);

var _vBranch = require('./v-branch.vue');

var _vBranch2 = _interopRequireDefault(_vBranch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var uid = 0;

exports.default = {
  name: 'v-folder',
  mixins: [_mixin2.default],
  props: {
    data: Object,
    ajax: Object,
    conf: Object
  },
  components: {
    'v-node': _vNode2.default,
    'v-leaf': _vLeaf2.default,
    'v-branch': _vBranch2.default
  },
  watch: {
    data: function data(newVal, oldVal) {
      var nameKey = this.conf && this.conf.node || 'name';
      if (newVal[nameKey] !== oldVal[nameKey]) {
        this.store = new _store2.default(newVal, this.conf);
      }
    }
  },
  data: function data() {
    return {
      uid: uid++,
      store: new _store2.default(this.data, this.conf)
    };
  },


  computed: {
    root: function root() {
      return this.store.dataStore;
    },
    branches: function branches() {
      return this.root.branches;
    },
    leafs: function leafs() {
      return this.root.leafs;
    },
    node: function node() {
      return this.root.node;
    }
  },

  methods: {
    resTransform: function resTransform(data, node) {
      var conf = this.conf || {};
      var dirKey = conf['branch'] || 'dirs';
      var fileKey = conf['leaf'] || 'files';
      var nameKey = conf['node'] || 'name';

      data[nameKey] = node.name;
      data[dirKey] = data[dirKey].map(function (d) {
        return _defineProperty({}, nameKey, d);
      });
      return data;
    },
    getReqConf: function getReqConf(node) {
      var reqConf = this.ajax || {};
      var url = reqConf.url,
          method = reqConf.method,
          data = reqConf.data,
          params = reqConf.params,
          pathAs = reqConf.pathAs,
          headers = reqConf.headers;


      if (method || method.toUpperCase() === 'GET') {
        reqConf.params = params || {};
        reqConf.params[pathAs] = node.path;
      } else {
        reqConf.data = data || {};
        reqConf.data[pathAs] = node.path;
      }

      reqConf.method = method || 'GET';
      reqConf.headers = headers || {};

      return reqConf;
    },
    request: function request(node) {
      var _this = this;

      if (!this.ajax) {
        return Promise.reject('ajax:false');
      }

      var process = this.ajax.process || function (res) {
        return res;
      };

      return this.$http(this.getReqConf(node)).then(function (res) {
        var data = process(res.data);
        return _this.resTransform(data, node);
      });
    }
  },

  created: function created() {
    var _this2 = this;

    this.listen('change', function (node) {
      _this2.store.commit('change', node).then(function (res) {
        return _this2.$emit('change', res);
      });
    });

    this.listen('unfold', function (node) {
      if (node.open && node.canOpen) {
        node.open = !node.open;
        return;
      }

      _this2.store.commit('unfold', node).then(function () {

        _this2.request(node).then(function (data) {
          if (data) {
            _this2.store.merge(data, node);
          } else {
            throw 'empty';
          }
        }).catch(function (e) {
          node.status = 'empty';
          window.console && console.error(e);
        });
      }).catch(function (e) {
        return node.status = 'done';
      });
    });
  },
  destroyed: function destroyed() {
    this.distroy();
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"v-branch-body"},[_c('v-node',{attrs:{"data":_vm.node,"uid":_vm.uid}}),_vm._v(" "),_vm._l((_vm.branches),function(branch){return _c('v-branch',{directives:[{name:"show",rawName:"v-show",value:(_vm.node.open),expression:"node.open"}],attrs:{"data":branch,"uid":_vm.uid}})}),_vm._v(" "),_vm._l((_vm.leafs),function(leaf){return _c('v-leaf',{directives:[{name:"show",rawName:"v-show",value:(_vm.node.open),expression:"node.open"}],attrs:{"data":leaf,"uid":_vm.uid}})})],2)}
__vue__options__.staticRenderFns = []

},{"./mixin":5,"./store":6,"./v-branch.vue":10,"./v-leaf.vue":11,"./v-node.vue":12,"vueify/lib/insert-css":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var eventMix = exports.eventMix = function eventMix(Vue) {
  var hub = new Vue();
  var proto = Vue.prototype;

  proto.___von = function (type, cb) {
    var uid = this.uid;
    var vm = this;
    var fn = function fn(e) {
      if (uid === e.uid && cb) {
        cb(e.data);
      }
    };
    hub.$on("#" + uid + "@" + type, fn);
  };

  proto.___vemit = function (type, data) {
    var uid = this.uid;
    hub.$emit("#" + uid + "@" + type, { data: data, uid: uid });
  };

  proto.___voff = function (type, fn) {
    var uid = this.uid;

    if (type) {
      hub.$off("#" + uid + "@" + type, fn);
    } else {
      uid = "#" + uid + "@";
      var len = uid.length;
      var types = Object.keys(hub._events);
      var match = types.filter(function (k) {
        return k.indexOf(uid) === 0;
      });
      match.forEach(function (k) {
        hub.$off(k, fn);
      });
    }
  };
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  methods: {
    notify: function notify(type) {
      this.___vemit(type, this.data);
    },
    listen: function listen(type, fn) {
      this.___von(type, function (e) {
        fn(e);
      });
    },
    distroy: function distroy() {
      this.___voff();
    }
  }
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _objectAssign = require('./utils/object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _deepCopy = require('./utils/deepCopy');

var _deepCopy2 = _interopRequireDefault(_deepCopy);

var _transform = require('./transform');

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arrPush = [].push;
var defaultConf = {
  node: 'name',
  branch: 'dirs',
  leaf: 'files',
  open: false,
  check: -1
};

var Store = function () {
  function Store(data, conf) {
    _classCallCheck(this, Store);

    this.conf = (0, _objectAssign2.default)({}, defaultConf, conf);
    var path = data.path || data[this.conf.node] || '/';
    var name = path.split('/').filter(function (s) {
      return !!s;
    }).slice(-1)[0] || data.name;
    data.name = name;
    this.dataStore = (0, _transform2.default)(data, this.conf, '0', path);
  }

  /**
   * set data store
   * @private
   */


  _createClass(Store, [{
    key: 'replace',
    value: function replace(newTree) {
      this.dataStore = newTree;
    }

    /**
     * get parent branch by levelId.
     * result for a leaf is the branch it is on,
     * for a branch,  result is it's parent branch.
     * 
     * @private
     * @param levelId
     */

  }, {
    key: 'findParentBranch',
    value: function findParentBranch() {
      var levelId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var length = levelId.length;
      var branch = this.dataStore;

      if (length <= 1) {
        return null;
      }

      var lvs = levelId.split('.').slice(1, -1);
      var index = 0;

      while (branch && (index = lvs.shift())) {
        branch = branch.branches[index];
      }

      return branch;
    }

    /**
     * get current branch
     * 
     * @private
     * @param levelId 
     */

  }, {
    key: 'findCurrentBranch',
    value: function findCurrentBranch() {
      var levelId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var lvs = levelId.split('.').slice(1);
      var index = 0;
      var branch = this.dataStore;

      while (branch && (index = lvs.shift())) {
        branch = branch.branches[index];
      }

      return branch;
    }

    /**
     * check ascendents of certain level rescursively
     * to see if they should get checked
     * this is a passive ation
     * 
     * @private
     * @param branch    the descendent branch
     * @param check     the descendent's check status
     */

  }, {
    key: 'checkBranchAscendents',
    value: function checkBranchAscendents(branch, check) {
      if (!branch) return;

      var branches = branch.branches,
          leafs = branch.leafs,
          node = branch.node,
          level = branch.level;

      var nextStatus = 0;

      switch (check) {
        case 1:
          // at least nextStatus will be zero,
          // so let's see if all children checked
          var branchesAllChecked = !branches.length || !branches.some(function (b) {
            return b.node.check < 1;
          });
          var leafsAllChecked = !leafs.length || !leafs.some(function (f) {
            return f.check < 1;
          });
          nextStatus = branchesAllChecked && leafsAllChecked ? 1 : 0;
          break;

        case 0:
          // no doubt
          nextStatus = 0;
          break;

        case -1:
          // if all children are -1
          // we'll get -1
          // else we'll get 0
          var branchesAllUnchecked = !branches.length || !branches.some(function (b) {
            return b.node.check > -1;
          });
          var leafsAllUnChecked = !leafs.length || !leafs.some(function (f) {
            return f.check > -1;
          });
          nextStatus = branchesAllUnchecked && leafsAllUnChecked ? -1 : 0;
          break;
      }

      node.check = nextStatus;
      this.checkBranchAscendents(this.findParentBranch(level), nextStatus);
    }

    /**
     * check branch children and decendents.
     * if node is checked, all children are checked too and vice versa.
     *
     * @private
     * @param branch   current descendent branch
     * @param check    the ascendent's check status
     */

  }, {
    key: 'checkBranchDescendents',
    value: function checkBranchDescendents(branch, check) {
      var _this = this;

      branch.node.check = check;
      if (!check) return;
      branch.leafs.forEach(function (l) {
        return l.check = check;
      });
      branch.branches.forEach(function (b) {
        b.node.check = check;
        _this.checkBranchDescendents(b, check);
      });
    }

    /************************************************************************
     * * * * * * * * * * * * Public Method Below * * * * * * * * * * * * * * 
     ************************************************************************/
    /**
     * if one node is checked/unchecked,
     * we have to check/uncheck all ites descendents,
     * and find if its ascendents should be checked.
     * 
     * @param level  level of the node checked/unchecked
     */

  }, {
    key: 'checkNode',
    value: function checkNode(node) {
      // node.check: -1(unchecked) 0(imtermedite) 1(checked)
      // 0 -> 1 (and state 0 is passive)
      // 1 <=> -1
      var branch = this.findCurrentBranch(node.level);
      var checkState = branch.node.check;
      var nextState = checkState < 1 ? 1 : -1;
      this.checkBranchDescendents(branch, nextState);
      this.checkBranchAscendents(this.findParentBranch(branch.level), nextState);
    }

    /**
     * if a leaf is checked,
     * we have to check all its ascendents
     * to see if any should get checked to.
     * 
     * @param leaf
     */

  }, {
    key: 'checkLeaf',
    value: function checkLeaf(leaf) {
      var leafBranch = this.findParentBranch(leaf.level);
      var nextState = -1 * leaf.check;
      leaf.check = nextState;
      this.checkBranchAscendents(leafBranch, nextState);
    }

    /**
     * merge a branch to current tree
     * @param branch
     */

  }, {
    key: 'merge',
    value: function merge() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        level: '0',
        path: ''
      };
      var level = node.level,
          path = node.path,
          check = node.check;

      var lvs = level.split('.').slice(1);
      var branch = (0, _transform2.default)(data, this.conf, level, path);

      branch.node.open = true;
      branch.node.check = check;
      branch.node.status = 'done';

      if (lvs.length === 0) {
        this.replace(branch);
      } else {
        var clone = (0, _deepCopy2.default)(this.dataStore);
        var top = clone;
        var pos = lvs.pop();
        var index = 0;

        while (index = lvs.shift()) {
          top = top.branches[index];
        }
        top.branches.splice(pos, 1, branch);
        top.node.canOpen = true;

        this.replace(clone);
      }

      this.checkBranchDescendents(branch, check);
    }

    /**
     * deal with actions
     */

  }, {
    key: 'commit',
    value: function commit(action, elem) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var isNode = elem.type === 'node';

        if (action === 'change') {
          _this2[isNode ? 'checkNode' : 'checkLeaf'](elem);
          return resolve(_this2.getPathResult());
        }

        if (action === 'unfold' && isNode) {
          elem.open = !elem.open;

          if (!elem.canOpen && elem.status !== 'done') {
            elem.status = 'loading';
            resolve();
          } else {
            reject();
          }
        }
      });
    }

    /**
     * get result as path
     */

  }, {
    key: 'getPathResult',
    value: function getPathResult(branch) {
      var _this3 = this;

      branch = branch || this.dataStore;

      var result = [];
      var _branch = branch,
          node = _branch.node,
          branches = _branch.branches,
          leafs = _branch.leafs,
          path = _branch.path;


      if (node.check > 0) {
        result.push(branch.path);
      } else {
        leafs.forEach(function (_ref) {
          var check = _ref.check,
              path = _ref.path;

          if (check > 0) {
            result.push(path);
          }
        });

        branches.forEach(function (branch) {
          arrPush.apply(result, _this3.getPathResult(branch));
        });
      }

      return result;
    }
  }, {
    key: 'raw',
    value: function raw() {
      return _transform2.default.raw(this.dataStore, this.conf);
    }
  }]);

  return Store;
}();

exports.default = Store;
;

},{"./transform":7,"./utils/deepCopy":8,"./utils/object-assign":9}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * standardlize a normal tree object
 * 
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
exports.default = transform;


function transform() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = arguments[1];
  var level = arguments[2];
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

  path = path.replace(/^\s*\/+/, '/');
  var node = config.node,
      branch = config.branch,
      leaf = config.leaf,
      check = config.check,
      open = config.open;

  var name = data[node] || '/';
  var branches = data[branch] || [];
  var leafs = data[leaf] || [];
  var canOpen = branches.length > 0 || leafs.length > 0;

  if (!path) {
    path = name === '/' ? name : '/' + name;
  }

  branches = branches.map(function (item, i) {
    if (typeof item === 'string') {
      var o = {};
      o[node] = item;
      item = o;
    }

    return transform(item, config, level + '.' + i, path + '/' + item[node]);
  });

  leafs = leafs.map(function (leaf, i) {
    return {
      name: leaf,
      type: 'leaf',
      check: check,
      level: level + '.' + i,
      path: path + '/' + leaf
    };
  });

  var status = canOpen ? 'filled' : 'empty';

  return {
    name: name,
    type: 'branch',
    level: level,
    path: path,
    node: { name: name, open: level == '0' || open, canOpen: canOpen, check: check, level: level, path: path, type: 'node', status: status },
    branches: branches,
    leafs: leafs
  };
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = deepCopy;
/**
 * from https://github.com/vuejs/vuex/blob/dev/src/util.js
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
function deepCopy(obj) {
  var cache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // just return if obj is immutable value
  if (obj === null || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  var hit = find(cache, function (c) {
    return c.original === obj;
  });
  if (hit) {
    return hit.copy;
  }

  var copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy: copy
  });

  Object.keys(obj).forEach(function (key) {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// http://devdocs.io/javascript/global_objects/object/assign
if (typeof Object.assign != 'function') {
  Object.assign = function (target, varArgs) {
    // .length of function is 2
    'use strict';

    if (target == null) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
};

exports.default = Object.assign;

},{}],10:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mixin = require('./mixin');

var _mixin2 = _interopRequireDefault(_mixin);

var _vLeaf = require('./v-leaf.vue');

var _vLeaf2 = _interopRequireDefault(_vLeaf);

var _vNode = require('./v-node.vue');

var _vNode2 = _interopRequireDefault(_vNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-branch',
  mixins: [_mixin2.default],
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
  components: {
    'v-node': _vNode2.default,
    'v-leaf': _vLeaf2.default
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{key:_vm.data.node.level,staticClass:"v-branch"},[_c('ul',{staticClass:"v-branch-body"},[_c('v-node',{attrs:{"data":_vm.data.node,"uid":_vm.uid}}),_vm._v(" "),_vm._l((_vm.data.branches),function(branch){return _c('v-branch',{directives:[{name:"show",rawName:"v-show",value:(_vm.data.node.open),expression:"data.node.open"}],attrs:{"data":branch,"uid":_vm.uid}})}),_vm._v(" "),_vm._l((_vm.data.leafs),function(leaf){return _c('v-leaf',{directives:[{name:"show",rawName:"v-show",value:(_vm.data.node.open),expression:"data.node.open"}],attrs:{"data":leaf,"uid":_vm.uid}})})],2)])}
__vue__options__.staticRenderFns = []

},{"./mixin":5,"./v-leaf.vue":11,"./v-node.vue":12}],11:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mixin = require('./mixin');

var _mixin2 = _interopRequireDefault(_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = ['fa-square-o', 'fa-minus-square-o', 'fa-check-square-o'];

exports.default = {
  name: 'v-leaf',
  mixins: [_mixin2.default],
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
    className: function className() {
      return classNames[this.data.check + 1];
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{key:_vm.data.level,staticClass:"v-leaf",on:{"click":function($event){_vm.notify('change')}}},[_c('i',{staticClass:"fa",class:_vm.className}),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.data.name))])])}
__vue__options__.staticRenderFns = []

},{"./mixin":5}],12:[function(require,module,exports){
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mixin = require('./mixin');

var _mixin2 = _interopRequireDefault(_mixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = ['fa-square-o', 'fa-minus-square-o', 'fa-check-square-o'];

exports.default = {
  name: 'v-node',
  mixins: [_mixin2.default],
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
    folderClass: function folderClass() {
      var data = this.data;
      var folderLoding = data.status === 'loading';
      var folderOpen = data.canOpen && data.open;
      var isEmpty = !data.canOpen && data.status === 'done';
      return {
        'fa-spinner cursor-progress': folderLoding,
        'fa-folder-open-o': !folderLoding && folderOpen,
        'fa-folder-o': !folderLoding && !folderOpen,
        'cursor-no-ops': isEmpty
      };
    },
    checkboxClass: function checkboxClass() {
      return classNames[this.data.check + 1];
    }
  }
};
})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{key:_vm.data.level,staticClass:"v-node"},[_c('i',{staticClass:"fa",class:_vm.folderClass,on:{"click":function($event){_vm.notify('unfold')}}}),_vm._v(" "),_c('span',{on:{"click":function($event){_vm.notify('change')}}},[_c('i',{staticClass:"fa",class:_vm.checkboxClass}),_vm._v("\n    "+_vm._s(_vm.data.name)+"\n  ")])])}
__vue__options__.staticRenderFns = []

},{"./mixin":5}]},{},[2])(2)
});