(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var clone_1 = createCommonjsModule(function (module) {
var clone = (function() {
'use strict';

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    { circular = true; }

  if (typeof depth == 'undefined')
    { depth = Infinity; }

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      { return null; }

    if (depth === 0)
      { return parent; }

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (parent instanceof nativeMap) {
      child = new nativeMap();
    } else if (parent instanceof nativeSet) {
      child = new nativeSet();
    } else if (parent instanceof nativePromise) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) { child.lastIndex = parent.lastIndex; }
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (parent instanceof Error) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (parent instanceof nativeMap) {
      var keyIterator = parent.keys();
      while(true) {
        var next = keyIterator.next();
        if (next.done) {
          break;
        }
        var keyChild = _clone(next.value, depth - 1);
        var valueChild = _clone(parent.get(next.value), depth - 1);
        child.set(keyChild, valueChild);
      }
    }
    if (parent instanceof nativeSet) {
      var iterator = parent.keys();
      while(true) {
        var next = iterator.next();
        if (next.done) {
          break;
        }
        var entryChild = _clone(next.value, depth - 1);
        child.add(entryChild);
      }
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    { return null; }

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) { flags += 'g'; }
  if (re.ignoreCase) { flags += 'i'; }
  if (re.multiline) { flags += 'm'; }
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if ('object' === 'object' && module.exports) {
  module.exports = clone;
}
});

function transform$1(data, conf, level, path) {
  if ( data === void 0 ) data = {};
  if ( conf === void 0 ) conf = {};
  if ( level === void 0 ) level = '0';

  var newConf = index({}, conf, {
    node: 'name',
    branch: 'dirs',
    leaf: 'files',
    open: false,
    checked: false
  });
  
  var node = newConf.node;
  var branch = newConf.branch;
  var leaf = newConf.leaf;
  var checked = newConf.checked;
  var open = newConf.open;
  var name = data[node] || '/';
  var branches = data[branch] || [];
  var leafs   = data[leaf] || [];
  var canOpen  = branches.length > 0 || leafs.length > 0;
  
  path = path || ("/" + name);
  branches = branches.map(function (branch, i) {
    return transform$1(branch, newConf, (level + "." + i), (path + "/" + (branch.name)));
  });
  
  leafs = leafs.map(function (leaf, i) {
    return {
      name: leaf,
      type: 'leaf',
      checked: checked,
      level: (level + "." + i),
      path: (path + "/" + leaf)
    };
  });

  var status = canOpen ? 'filled' : 'empty';

  return {
    name: name,
    type: 'branch',
    level: level,
    path: path,
    node: { name: name, open: open, canOpen: canOpen, checked: checked, level: level, path: path, type: 'node', status: status },
    branches: branches,
    leafs: leafs,
  };
}

var arrPush = [].push;
var noop = function (_) { return _; };

var Store = function Store(data, conf) {
  this.dataStore = transform$1(data, conf);
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
    return null;
  }
    
  var lvs  = levelId.split('.').slice(1, -1);
  var index$$1= 0;

  while (branch && (index$$1 = lvs.shift())) {
    branch = branch.branches[index$$1];
  }

  return branch;
};

/**
 * get current branch
 * 
 * @private
 * @param levelId 
 */
Store.prototype.findCurrentBranch = function findCurrentBranch (levelId) {
    if ( levelId === void 0 ) levelId = '';

  var lvs  = levelId.split('.').slice(1);
  var index$$1= 0;
  var branch = this.dataStore;

  while (branch && (index$$1 = lvs.shift())) {
    branch = branch.branches[index$$1];
  }

  return branch;
};

/**
 * check ascendents of certain level rescursively
 * to see if they should get checked
 * 
 * @private
 * @param branch  the descendent branch
 * @param checkedif the descendent is checked
 */
Store.prototype.checkBranchAscendents = function checkBranchAscendents (branch, checked) {
  var nextStatus = false;

  if (branch) {
    if (checked) {
      var allBranchesChecked = !branch.branches.some(function (b) { return !b.node.checked; });
      var allLeavesChecked = !branch.leafs.some(function (l) { return !l.checked; });
      nextStatus = allBranchesChecked && allLeavesChecked;
    }

    branch.node.checked = nextStatus;
    this.checkBranchAscendents(this.findParentBranch(branch.level), nextStatus);
  }
};

/**
 * check branch children and decendents.
 * if node is checked, all children are checked too and vice versa.
 *
 * @private
 * @param branch current descendent branch
 * @param checkedif the ascendent is checked
 */
Store.prototype.checkBranchDescendents = function checkBranchDescendents (branch, checked) {
    var this$1 = this;

  branch.node.checked = checked;
  branch.leafs.forEach(function (l) { return l.checked = checked; });
  branch.branches.forEach(function (b) {
    b.node.checked = checked;
    this$1.checkBranchDescendents(b, checked);
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
  var branch = this.findCurrentBranch(node.level);
  var nextState = !branch.node.checked;
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
  var nextState = !leaf.checked;
  leaf.checked = nextState;
  this.checkBranchAscendents(leafBranch, nextState);
};

 /**
  * merge a branch to current tree
  * @param branch
  */
Store.prototype.merge = function merge (
  data,
  node,
  conf
) {
    if ( data === void 0 ) data = {};
    if ( node === void 0 ) node = {
    level: '0',
    path: ''
  };

  var level = node.level;
    var path = node.path;
    var checked = node.checked;
  var lvs = level.split('.').slice(1);
  var branch = transform$1(data, conf, level, path);
    
  branch.node.open = true;
  branch.node.checked = checked;
  branch.node.status = 'done';

  if (lvs.length === 0) {
    this.replace(branch);
  } else {
    var clone = clone_1(this.dataStore);
    var top = clone;
    var pos = lvs.pop();
    var index$$1 = 0;

    while (index$$1 = lvs.shift()) {
      top = top.branches[index$$1];
    }
    top.branches.splice(pos, 1, branch);
    top.node.canOpen = true;

    this.replace(clone);
  }


  this.checkBranchDescendents(branch, checked);
};

/**
 * deal with actions
 */
Store.prototype.commit = function commit (action, elem, callback) {
    if ( callback === void 0 ) callback = noop;

  var isNode = elem.type === 'node';
    
  switch (action) {
    case 'change':
      this[isNode ? 'checkNode' : 'checkLeaf'](elem);
      callback(this.getPathResult());
      break;

    case 'fold':
      if (isNode) {
        elem.open = !elem.open;
        elem.canOpen || elem.status === 'done' || callback();
      }
      break;
  }
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
    var path = branch.path;

  if (node.checked) {
    result.push(branch.path);
  } else {
    leafs.forEach(function (ref) {
        var checked = ref.checked;
        var path = ref.path;

      if (checked) {
        result.push(path);
      }
    });

    branches.forEach(function (branch) {
      arrPush.apply(result, this$1.getPathResult(branch));
    });
  }

  return result;
};

var VNode = { template: "<li class=\"v-node\" :key=\"data.level\"><i class=\"fa\" :class=\"icon\" @click=\"notify('unfold')\"></i> <span @click=\"notify('change')\"><i class=\"fa\" :class=\"[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]\"></i> {{data.name}}</span></li>",
  name: 'v-node',
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
    icon: function icon() {
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
    }
  }
};

var VLeaf = { template: "<li class=\"v-leaf\" @click=\"notify('change')\" :key=\"data.level\"><i class=\"fa\" :class=\"[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]\"></i> {{data.name}}</li>",
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

var VBranch = { template: "<li :key=\"node.level\" class=\"v-branch\"><ul class=\"v-branch-body\"><v-node :data=\"node\" :uid=\"uid\"></v-node><v-branch v-show=\"node.open\" v-for=\"branch in branches\" :data=\"branch\" :uid=\"uid\"></v-branch><v-leaf v-show=\"node.open\" v-for=\"leaf in leafs\" :data=\"leaf\" :uid=\"uid\"></v-leaf></ul></li>",
  name: 'v-branch',
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
  },
  computed: {
    branches: function branches() {
      return this.data.branches;
    },
    leafs: function leafs() {
      return this.data.leafs;
    },
    node: function node() {
      return  this.data.node;
    }
  }
};

var VTree = { template: "<ul class=\"v-branch-body\"><v-node :data=\"node\" :uid=\"uid\"></v-node><v-branch v-show=\"node.open\" v-for=\"branch in branches\" :data=\"branch\" :uid=\"uid\"></v-branch><v-leaf v-show=\"node.open\" v-for=\"leaf in leafs\" :data=\"leaf\" :uid=\"uid\"></v-leaf></ul>",
  name: 'v-tree',
  props: {
    store: {
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
    'v-leaf': VLeaf,
    'v-branch': VBranch
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
  created: function created() {
    var this$1 = this;

    this.listen('unfold', function (node) {
      this$1.store.commit('fold', node, function () {
        node.status = 'loading';
        this$1.$emit('request', node, function (data) {
          this$1.store.merge(data, node);
        });
        
      });
    });

    this.listen('change', function (node) {
      this$1.store.commit('change', node, function (result) {
        this$1.$emit('change', result);
      });
    });
  }
};

var KEY_MAP = {};
var VFolderComp = { template: "<v-tree :store=\"store\" @change=\"change\" @request=\"request\" :uid=\"uid\"></v-tree>",
  name: 'v-folder',
  props: {
    data: Object,
    uid: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    'v-tree': VTree
  },
  data: function data() {
    return {
      store: new Store(this.data)
    };
  },
  methods: {
    change: function change(result) {
      this.$emit('change', result);
    },
    request: function request(node, done) {
      this.$emit('request', node, done);
    }
  },
  created: function created() {
    var uid = this.uid;
    if (uid in KEY_MAP) {
      throw 'each <v-folder> instance must get an unique `uid` property';
    } else {
      KEY_MAP[uid] = null;
    }
  }
};

var EventMixin = {
  methods: {
    notify: function notify(type) {
      {
        console.info('[event type]:', type);
      }
      this.___vemit(type, this.data);
    },
    listen: function listen(type, fn) {
      this.___von(type, function (e) {
        fn(e);
      });
    }
  },
  destroyed: function destroyed() {
    this.___voff();
  }
};

var index$1 = createCommonjsModule(function (module, exports) {
/* global define */
(function (root, factory) {
    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {

    var semver = /^v?(?:0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
    var patch = /-([0-9A-Za-z-.]+)/;

    function split(v) {
        var temp = v.split('.');
        var arr = temp.splice(0, 2);
        arr.push(temp.join('.'));
        return arr;
    }

    function tryParse(v) {
        return isNaN(Number(v)) ? v : Number(v);
    }

    function validate(version) {
        if (typeof version !== 'string') {
            throw new TypeError('Invalid argument expected string');
        }
        if (!semver.test(version)) {
            throw new Error('Invalid argument not valid semver');
        }
    }

    return function compareVersions(v1, v2) {
        [v1, v2].forEach(validate);

        var s1 = split(v1);
        var s2 = split(v2);

        for (var i = 0; i < 3; i++) {
            var n1 = parseInt(s1[i] || 0, 10);
            var n2 = parseInt(s2[i] || 0, 10);

            if (n1 > n2) { return 1; }
            if (n2 > n1) { return -1; }
        }

        if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
            var p1 = patch.exec(s1[2])[1].split('.').map(tryParse);
            var p2 = patch.exec(s2[2])[1].split('.').map(tryParse);

            for (i = 0; i < Math.max(p1.length, p2.length); i++) {
                if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') { return -1; }
                if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') { return 1; }

                if (p1[i] > p2[i]) { return 1; }
                if (p2[i] > p1[i]) { return -1; }
            }
        } else if ([s1[2], s2[2]].some(patch.test.bind(patch))) {
            return patch.test(s1[2]) ? -1 : 1;
        }

        return 0;
    };

}));
});

var checkVersion = function () {
  var compare = function (v1, v2) {
    return index$1(v1, v2) >= 0;
  };

  // if must compile template
  if (!compare(Vue.version, '2.0.0')) {
    throw 'This module can only supports vue@2!';
  }
};

var eventMix = function () {
  var hub = new Vue();
  var proto = Vue.prototype;

  proto.___von = function (type, cb) {
    var uid = this.uid;
    var vm = this;
    var fn = function(e) {
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
      var len = uid.length;
      var types = Object.keys(hub._events);
      var match = types.filter(function (k) { return k.indexOf(uid) === 0; });
      match.forEach(function (k) {
        hub.$off(k, fn);
      });
    }
  };
};

VFolderComp.install = function (Vue) {
  checkVersion(Vue);
  eventMix(Vue);
  Vue.mixin(EventMixin);
  Vue.component(VFolderComp.name, VFolderComp);
};
Vue.use(VFolderComp);


var DATA = {
  name: 'new folder',
  dirs: [{name: 'empty folder'}],
  files: ['1.js', '2.js']
};
var EMPTY = {
  name: 'empty',
  dirs: [],
  files: []
};

new Vue({
  el: '#app',
  template: "\n    <div>\n      <v-folder\n        :uid=\"uid\"\n        :data=\"data\"\n        :ajax=\"ajax\"\n        @change=\"onChange\"\n        @request=\"onRequest\"\n      ></v-folder>\n    </div>\n  ",
  data: function data() {
    return {
      uid: '23333',
      data: {
        name: '根目录',
        files: ['1.js', '2.js'],
        dirs: [{name: 'empty folder'}, {name: 'empty folder'}, {name: 'empty folder'}]
      },
      ajax: {}
    };
  },
  methods: {
    onChange: function onChange(result) {
      console.log(result);
    },
    onRequest: function onRequest(node, done) {
      this.fetch(node).then(function (data) {
        done(data);
      });
    },
    fetch: function fetch(node) {
      return new Promise(function (res) {
        setTimeout(function () { return res(Math.random() > .7 ? EMPTY : DATA); }, 5000);
      });
    }
  }
});

})));
//# sourceMappingURL=bundle.common.js.map
