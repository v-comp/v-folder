(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VFolder = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

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
function deepCopy (obj, cache) {
  if ( cache === void 0 ) cache = [];

  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  var hit = find(cache, function (c) { return c.original === obj; });
  if (hit) {
    return hit.copy
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

  return copy
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find (list, f) {
  return list.filter(f)[0]
}

/**
 * standardlize a normal tree object
 *
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
function transform$1 (data, config, level, path) {
  if ( data === void 0 ) data = {};
  if ( path === void 0 ) path = '';

  path = path.replace(/^\s*\/+/, '/');
  var node = config.node;
  var branch = config.branch;
  var leaf = config.leaf;
  var check = config.check;
  var open = config.open;
  var name = data[node] || '/';
  var branches = data[branch] || [];
  var leafs = data[leaf] || [];
  var canOpen = branches.length > 0 || leafs.length > 0;

  if (!path) {
    path = name === '/' ? name : ("/" + name);
  }

  branches = branches.map(function (item, i) {
    if (typeof item === 'string') {
      var o = {};
      o[node] = item;
      item = o;
    }

    return transform$1(item, config, (level + "." + i), (path + "/" + (item[node])))
  });

  leafs = leafs.map(function (leaf, i) {
    return {
      name: leaf,
      type: 'leaf',
      check: check,
      level: (level + "." + i),
      path: (path + "/" + leaf)
    }
  });

  var status = canOpen ? 'filled' : 'empty';

  return {
    name: name,
    type: 'branch',
    level: level,
    path: path,
    node: { name: name, open: +level === 0 || open, canOpen: canOpen, check: check, level: level, path: path, type: 'node', status: status },
    branches: branches,
    leafs: leafs
  }
}

var arrPush = [].push;
var defaultConf = {
  node: 'name',
  branch: 'dirs',
  leaf: 'files',
  open: false,
  check: -1
};

var Store = function Store (data, conf) {
  this.conf = index({}, defaultConf, conf);
  var path = data.path || data[this.conf.node] || '/';
  var name = path.split('/').filter(function (s) { return !!s; }).slice(-1)[0] || data.name;
  data.name = name;
  this.dataStore = transform$1(data, this.conf, '0', path);
};

/**
 * set data store
 * @private
 */
Store.prototype.replace = function replace (newTree) {
  this.dataStore = newTree;
};

/**
 * get parent branch by levelId.
 * result for a leaf is the branch it is on,
 * for a branch,result is it's parent branch.
 *
 * @private
 * @param levelId
 */
Store.prototype.findParentBranch = function findParentBranch (levelId) {
    if ( levelId === void 0 ) levelId = '';

  var length = levelId.length;
  var branch = this.dataStore;

  if (length <= 1) {
    return null
  }

  var lvs = levelId.split('.').slice(1, -1);
  var index$$1 = 0;

  while (branch && (index$$1 = lvs.shift())) {
    branch = branch.branches[index$$1];
  }

  return branch
};

/**
 * get current branch
 *
 * @private
 * @param levelId
 */
Store.prototype.findCurrentBranch = function findCurrentBranch (levelId) {
    if ( levelId === void 0 ) levelId = '';

  var lvs = levelId.split('.').slice(1);
  var index$$1 = 0;
  var branch = this.dataStore;

  while (branch && (index$$1 = lvs.shift())) {
    branch = branch.branches[index$$1];
  }

  return branch
};

/**
 * check ascendents of certain level rescursively
 * to see if they should get checked
 * this is a passive ation
 *
 * @private
 * @param branch  the descendent branch
 * @param check   the descendent's check status
 */
Store.prototype.checkBranchAscendents = function checkBranchAscendents (branch, check) {
  if (!branch) { return }

  var branches = branch.branches;
    var leafs = branch.leafs;
    var node = branch.node;
    var level = branch.level;
  var nextStatus = 0;

  switch (check) {
    case 1:
      // at least nextStatus will be zero,
      // so let's see if all children checked
      var branchesAllChecked = !branches.length || !branches.some(function (b) { return b.node.check < 1; });
      var leafsAllChecked = !leafs.length || !leafs.some(function (f) { return f.check < 1; });
      nextStatus = branchesAllChecked && leafsAllChecked ? 1 : 0;
      break

    case 0:
      // no doubt
      nextStatus = 0;
      break

    case -1:
      // if all children are -1
      // we'll get -1
      // else we'll get 0
      var branchesAllUnchecked = !branches.length || !branches.some(function (b) { return b.node.check > -1; });
      var leafsAllUnChecked = !leafs.length || !leafs.some(function (f) { return f.check > -1; });
      nextStatus = branchesAllUnchecked && leafsAllUnChecked ? -1 : 0;
      break
  }

  node.check = nextStatus;
  this.checkBranchAscendents(this.findParentBranch(level), nextStatus);
};

/**
 * check branch children and decendents.
 * if node is checked, all children are checked too and vice versa.
 *
 * @private
 * @param branch current descendent branch
 * @param check  the ascendent's check status
 */
Store.prototype.checkBranchDescendents = function checkBranchDescendents (branch, check) {
    var this$1 = this;

  branch.node.check = check;
  if (!check) { return }
  branch.leafs.forEach(function (l) {
    l.check = check;
  });

  branch.branches.forEach(function (b) {
    b.node.check = check;
    this$1.checkBranchDescendents(b, check);
  });
};

/************************************************************************
 * * * * * * * * * * * * Public Method Below * * * * * * * * * * * * * *
 ************************************************************************/
/**
 * if one node is checked/unchecked,
 * we have to check/uncheck all ites descendents,
 * and find if its ascendents should be checked.
 *
 * @param levellevel of the node checked/unchecked
 */
Store.prototype.checkNode = function checkNode (node) {
  // node.check: -1(unchecked) 0(imtermedite) 1(checked)
  // 0 -> 1 (and state 0 is passive)
  // 1 <=> -1
  var branch = this.findCurrentBranch(node.level);
  var checkState = branch.node.check;
  var nextState = checkState < 1 ? 1 : -1;
  this.checkBranchDescendents(branch, nextState);
  this.checkBranchAscendents(this.findParentBranch(branch.level), nextState);
};

/**
 * if a leaf is checked,
 * we have to check all its ascendents
 * to see if any should get checked to.
 *
 * @param leaf
 */
Store.prototype.checkLeaf = function checkLeaf (leaf) {
  var leafBranch = this.findParentBranch(leaf.level);
  var nextState = -1 * leaf.check;
  leaf.check = nextState;
  this.checkBranchAscendents(leafBranch, nextState);
};

 /**
  * merge a branch to current tree
  * @param branch
  */
Store.prototype.merge = function merge (
  data,
  node
) {
    if ( data === void 0 ) data = {};
    if ( node === void 0 ) node = {
    level: '0',
    path: ''
  };

  var level = node.level;
    var path = node.path;
    var check = node.check;
  var lvs = level.split('.').slice(1);
  var branch = transform$1(data, this.conf, level, path);

  branch.node.open = true;
  branch.node.check = check;
  branch.node.status = 'done';

  if (lvs.length === 0) {
    this.replace(branch);
  } else {
    var store = this.dataStore;
    var clone = deepCopy(store);
    var top = clone;
    var pos = lvs.pop();
    var index$$1 = 0;

    // eslint-disable-next-line
    while (index$$1 = lvs.shift()) {
      top = top.branches[index$$1];
    }
    top.branches.splice(pos, 1, branch);
    top.node.canOpen = true;

    this.replace(clone);
  }

  this.checkBranchDescendents(branch, check);
};

/**
 * deal with actions
 */
Store.prototype.commit = function commit (action, elem) {
    var this$1 = this;

  return new Promise(function (resolve, reject) {
    var isNode = elem.type === 'node';

    if (action === 'change') {
      this$1[isNode ? 'checkNode' : 'checkLeaf'](elem);
      return resolve(this$1.getPathResult())
    }

    if (action === 'unfold' && isNode) {
      elem.open = !elem.open;

      if (!elem.canOpen && elem.status !== 'done') {
        elem.status = 'loading';
        resolve();
      } else {
        // eslint-disable-next-line
        reject();
      }
    }
  })
};

/**
 * get result as path
 */
Store.prototype.getPathResult = function getPathResult (branch) {
    var this$1 = this;

  branch = branch || this.dataStore;

  var result = [];
  var node = branch.node;
    var branches = branch.branches;
    var leafs = branch.leafs;

  if (node.check > 0) {
    result.push(branch.path);
  } else {
    leafs.forEach(function (ref) {
        var check = ref.check;
        var path = ref.path;

      if (check > 0) {
        result.push(path);
      }
    });

    branches.forEach(function (branch) {
      arrPush.apply(result, this$1.getPathResult(branch));
    });
  }

  return result
};

Store.prototype.raw = function raw () {
  return transform$1.raw(this.dataStore, this.conf)
};

var EventMixin = {
  methods: {
    notify: function notify (type) {
      this.___vemit(type, this.data);
    },
    listen: function listen (type, fn) {
      this.___von(type, function (e) {
        fn(e);
      });
    },
    distroy: function distroy () {
      this.___voff();
    }
  }
};

var classNames = [
  'fa-square-o',
  'fa-minus-square-o',
  'fa-check-square-o' ];

var VNode = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{key:_vm.data.level,staticClass:"v-node"},[_c('i',{staticClass:"fa",class:_vm.folderClass,on:{"click":function($event){_vm.notify('unfold');}}}),_vm._v(" "),_c('i',{staticClass:"fa",class:_vm.checkboxClass,on:{"click":function($event){_vm.notify('change');}}}),_vm._v(" "),_c('span',{on:{"click":function($event){_vm.notify('change');}}},[_vm._v(_vm._s(_vm.data.name))])])},staticRenderFns: [],
  name: 'v-node',
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
      }
    },
    checkboxClass: function checkboxClass() {
      return classNames[this.data.check + 1]
    }
  }
};

var classNames$1 = [
  'fa-square-o',
  'fa-minus-square-o',
  'fa-check-square-o' ];

var VLeaf = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{key:_vm.data.level,staticClass:"v-leaf",on:{"click":function($event){_vm.notify('change');}}},[_c('i',{staticClass:"fa",class:_vm.className}),_c('span',[_vm._v(_vm._s(_vm.data.name))])])},staticRenderFns: [],
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
    className: function className() {
      return classNames$1[this.data.check + 1]
    }
  }
};

var VBranch = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{key:_vm.data.node.level,staticClass:"v-branch"},[_c('ul',{staticClass:"v-branch-body"},[_c('v-node',{attrs:{"data":_vm.data.node,"uid":_vm.uid}}),_vm._l((_vm.data.branches),function(branch){return _c('v-branch',{directives:[{name:"show",rawName:"v-show",value:(_vm.data.node.open),expression:"data.node.open"}],key:_vm.data.node.name,attrs:{"data":branch,"uid":_vm.uid}})}),_vm._l((_vm.data.leafs),function(leaf){return _c('v-leaf',{directives:[{name:"show",rawName:"v-show",value:(_vm.data.node.open),expression:"data.node.open"}],key:_vm.data.node.name,attrs:{"data":leaf,"uid":_vm.uid}})})],2)])},staticRenderFns: [],
  name: 'v-branch',
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
  components: {
    'v-node': VNode,
    'v-leaf': VLeaf
  }
};

__$styleInject(".v-branch-body{font-family:PingFang SC,Lantinghei SC,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,STHeitiSC-Light,simsun,WenQuanYi Zen Hei,WenQuanYi Micro Hei,\"sans-serif\";padding:0;list-style:none}.v-branch-body>.v-branch{padding-left:1.2em}.v-branch>ul{margin:0;padding:0;list-style:none}.v-leaf,.v-node{display:flex;align-items:center;padding:0 0 0 1.2em;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;cursor:pointer}.v-leaf{margin:0 0 0 1.2em}.v-leaf span,.v-node span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.v-leaf>.fa,.v-node>.fa{width:1.2em;flex:auto 0 0;color:#0d83e6;vertical-align:middle;cursor:pointer}.v-leaf>.fa:before,.v-node>.fa:before{vertical-align:middle}.v-leaf .fa:hover,.v-node .fa:hover{color:#0c71c5}.v-node>.cursor-no-ops{cursor:not-allowed}.v-node>.cursor-progress{cursor:progress}",undefined);

var uid = 0;

var VFolderComp$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('ul',{staticClass:"v-branch-body"},[_c('v-node',{attrs:{"data":_vm.node,"uid":_vm.uid}}),_vm._l((_vm.branches),function(branch){return _c('v-branch',{directives:[{name:"show",rawName:"v-show",value:(_vm.node.open),expression:"node.open"}],attrs:{"data":branch,"uid":_vm.uid}})}),_vm._l((_vm.leafs),function(leaf){return _c('v-leaf',{directives:[{name:"show",rawName:"v-show",value:(_vm.node.open),expression:"node.open"}],attrs:{"data":leaf,"uid":_vm.uid}})})],2)},staticRenderFns: [],
  name: 'v-folder',
  mixins: [EventMixin],
  props: {
    data: Object,
    ajax: Object,
    conf: Object
  },
  components: {
    'v-node': VNode,
    'v-leaf': VLeaf,
    'v-branch': VBranch
  },
  watch: {
    data: function data(newVal, oldVal) {
      var nameKey = this.conf && this.conf.node || 'name';
      if (newVal[nameKey] !== oldVal[nameKey]) {
        this.store = new Store(newVal, this.conf);
      }
    }
  },
  data: function data() {
    return {
      uid: uid++,
      store: new Store(this.data, this.conf)
    }
  },

  computed: {
    root: function root() {
      return this.store.dataStore
    },
    branches: function branches() {
      return this.root.branches
    },
    leafs: function leafs() {
      return this.root.leafs
    },
    node: function node() {
      return this.root.node
    }
  },
  
  methods: {
    resTransform: function resTransform(data, node) {
      var conf = this.conf || {};
      var dirKey  = conf['branch'] || 'dirs';
      var nameKey = conf['node'] || 'name';

      data[nameKey] = node.name;
      data[dirKey]  = data[dirKey].map(function (d) { return (( obj = {}, obj[nameKey] = d, obj))
        var obj; });
      return data
    },

    getReqConf: function getReqConf(node) {
      var reqConf = this.ajax || {};
      var method = reqConf.method;
      var data = reqConf.data;
      var params = reqConf.params;
      var pathAs = reqConf.pathAs;
      var headers = reqConf.headers;

      if (method || method.toUpperCase() === 'GET') {
        reqConf.params = (params || {});
        reqConf.params[pathAs] = node.path;
      } else {
        reqConf.data = (data || {});
        reqConf.data[pathAs] = node.path;
      }

      reqConf.method = method || 'GET';
      reqConf.headers = headers || {};

      return reqConf
    },

    request: function request(node) {
      var this$1 = this;

      if (!this.ajax) {
        return Promise.reject('ajax:false')
      }

      var process = this.ajax.process || (function (res) { return res; });

      return this.$http(this.getReqConf(node))
        .then(function (res) {
          var data = process(res.data);
          return this$1.resTransform(data, node)
        })
    }
  },

  created: function created() {
    var this$1 = this;

    this.listen('change', function (node) {
      this$1.store
        .commit('change', node)
        .then(function (res) { return this$1.$emit('change', res); });
    });

    this.listen('unfold', function (node) {
      if (node.open && node.canOpen) {
        node.open =! node.open;
        return
      }

      this$1.store
        .commit('unfold', node)
        .then(function () {

          this$1.request(node)
          .then(function (data) {
            if (data) {
              this$1.store.merge(data, node);
            } else {
              throw 'empty'
            }
          })
          .catch(function (e) {
            node.status = 'empty';
            window.console && console.error(e);
          });

        })
        .catch(function (e) {
          node.status = 'done';
        });

    });
  },
  destroyed: function destroyed () {
    this.distroy();
  }
};

var eventMix = function (Vue) {
  var hub = new Vue();
  var proto = Vue.prototype;

  proto.___von = function (type, cb) {
    var uid = this.uid;

    var fn = function (e) {
      if (uid === e.uid && cb) {
        cb(e.data);
      }
    };

    hub.$on(("#" + uid + "@" + type), fn);
  };

  proto.___vemit = function (type, data) {
    var uid = this.uid;
    hub.$emit(("#" + uid + "@" + type), { data: data, uid: uid });
  };

  proto.___voff = function (type, fn) {
    var uid = this.uid;

    if (type) {
      hub.$off(("#" + uid + "@" + type), fn);
    } else {
      uid = "#" + uid + "@";
      var types = Object.keys(hub._events);
      var match = types.filter(function (k) { return k.indexOf(uid) === 0; });
      match.forEach(function (k) {
        hub.$off(k, fn);
      });
    }
  };
};

VFolderComp$1.install = function (Vue) {
  var ref = Vue.version.split('.');
  var major = ref[0];
  var minor = ref[1];
  var patch = ref[2];

  var versionOk = major > 2 || (+major === 2 && (minor > 1 || (+minor === 1 && patch >= 5)));

  if (!versionOk) {
    throw new Error('You should at least get Vue.js@2.1.5.')
  }

  eventMix(Vue);
  Vue.component(VFolderComp$1.name, VFolderComp$1);
};

if (typeof winodw !== 'undefined' && window.Vue) {
  window.Vue.use(VFolderComp$1);
}

return VFolderComp$1;

})));
//# sourceMappingURL=build.js.map
