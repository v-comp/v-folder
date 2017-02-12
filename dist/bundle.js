(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vTreeSelect = factory());
}(this, (function () { 'use strict';

/**
 * standardlize a normal tree object
 * 
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
var transform$1 = function (data, conf, level, path) {
  if ( data === void 0 ) data = {};
  if ( conf === void 0 ) conf = {};
  if ( level === void 0 ) level = '0';
  if ( path === void 0 ) path = '';

  var newConf = Object.assign({}, conf, defaultConf$1);
  
  var node = newConf.node;
  var branch = newConf.branch;
  var leaf = newConf.leaf;
  var checked = newConf.checked;
  var open = newConf.open;
  var name = data[node] || '/';
  var branches = data[branch] || [];
  var leafs   = data[leaf] || [];
  var canOpen  = branches.length > 0 || leafs.length > 0;

  branches = branches.map(function (branch, i) {
    return transform$1(branch, newConf, (level + "." + i), (path + "/" + (branch.name)));
  });
  
  leafs = leafs.map(function (leaf, i) {
    return {
      checked: checked,
      name: leaf,
      level: (level + "." + i),
      path: (path + "/" + leaf)
    };
  });

  return {
    name: name,
    level: level,
    path: path,
    node: { name: name, open: open, canOpen: canOpen, checked: checked, level: level },
    branches: branches,
    leafs: leafs
  };
};

var defaultConf$1 = {
  node: 'name',
  branch: 'dirs',
  leaf: 'files',
  open: false,
  checked: false
};

var transform_1 = {
  transform: transform$1,
  defaultConf: defaultConf$1
};

var transform = transform_1.transform;
var defaultConf = transform_1.defaultConf;
var arrPush = [].push;

var store = (function () {
  function Store(data, conf) {
    this.dataStore = this.setStore(data, conf);
  }

  /**
   * set data store
   */
  Store.prototype.setStore = function setStore (data, conf) {
    if ( data === void 0 ) data = {};
    if ( conf === void 0 ) conf = defaultConf;

    return (this.dataStore = transform(data, conf));
  };

  /**
   * get parent branch by levelId.
   * result for a leaf is the branch it is on,
   * for a branch,  result is it's parent branch.
   * 
   * @param levelId
   */
  Store.prototype.findParentBranch = function findParentBranch (levelId) {
    if ( levelId === void 0 ) levelId = '';

    var length = levelId.length;
    var branch = this.dataStore;

    if (length <= 1) {
      return null;
    }
    
    var lvs    = levelId.split('.').slice(1, -1);
    var index  = 0;

    while (branch && (index = lvs.shift())) {
      branch = branch.branches[index];
    }

    return branch;
  };

  /**
   * get current branch
   * 
   * @param levelId 
   */
  Store.prototype.findCurrentBranch = function findCurrentBranch (levelId) {
    if ( levelId === void 0 ) levelId = '';

    var lvs    = levelId.split('.').slice(1);
    var index  = 0;
    var branch = this.dataStore;

    while (branch && (index = lvs.shift())) {
      branch = branch.branches[index];
    }

    return branch;
  };

  /**
   * @param data     replace empty branch
   * @param levelId  inditifying where to replace
   * @param conf     contains keys to extract data from `data` 
   */
  Store.prototype.replaceBranch = function replaceBranch (data, levelId, conf) {
    if ( levelId === void 0 ) levelId = '0';
    if ( conf === void 0 ) conf = defaultConf;

    var lvs    = levelId.split('.').slice(1);
    var index  = 0;
    var clone  = Object.assign({}, this.dataStore);
    var parent = clone;
    var replacePos = lvs.pop();

    while (parent && (index = lvs.shift())) {
      parent = parent.branches[index];
    }

    parent.branches[replacePos] = transform(data, conf, levelId);

    return (this.dataStore = clone);
  };

  /**
   * check ascendents of certain level rescursively
   * to see if they should get checked
   * 
   * @param level    the descendent levelId
   * @param checked  if the descendent is checked
   */
  Store.prototype.checkAscendents = function checkAscendents (level, checked) {
    var branch = this.findParentBranch(level);
    var nextStatus = false;

    if (branch) {
      if (checked) {
        var allBranchesChecked = !branch.branches.some(function (b) { return !b.node.checked; });
        var allLeavesChecked   = !branch.leafs.some(function (l) { return !l.checked; });
        nextStatus = allBranchesChecked && allLeavesChecked;
      }

      branch.node.checked = nextStatus;
      this.checkAscendents(branch.level, nextStatus);
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

  return Store;
}());

var mixin = {
  created: function created() {
    var this$1 = this;

    /**
     * when the branch is checked/unchecked
     * all descendents should be checked/unchecked too
     */
    this.__EVENT_BUS.$on('descendents_force_checked', function (level, checked) {
      var lvId = this$1.data.level;

      if (
        lvId.indexOf(level) === 0
        && lvId.slice(level.length).length > 0
      ) {
        this$1.data.checked = checked;
      }
    });


  }
};

var VNode = { template: "<li class=\"v-node\"><i class=\"fa\" :class=\"[ data.canOpen && data.open ? 'fa-folder-open-o' : 'fa-folder-o' ]\" @click=\"toggleExpanded\"></i> <span @click=\"toggleChecked\"><i class=\"fa\" :class=\"[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]\"></i> {{data.name}}</span></li>",
  props: {
    data: Object,
  },
  mixins: [mixin],
  methods: {
    toggleChecked: function toggleChecked() {
      this.__EVENT_BUS.$emit('node_toggle_checked', this.data);
    },
    toggleExpanded: function toggleExpanded() {
      this.__EVENT_BUS.$emit('node_toggle_expanded', this.data);
    }
  },
  created: function created() {}
};

var VLeaf = { template: "<li class=\"v-leaf\" @click=\"toggleChecked\"><i class=\"fa\" :class=\"[ data.checked ? 'fa-check-square-o' : 'fa-square-o' ]\"></i> {{data.name}}</li>",
  props: {
    data: Object
  },
  mixins: [mixin],
  methods: {
    toggleChecked: function toggleChecked() {
      this.__EVENT_BUS.$emit('leaf_toggle_checked', this.data);
    }
  },
  created: function created() {}
};

var VBranch = { template: "<ul class=\"branch\"><v-node :data=\"node\"></v-node><v-branch v-show=\"node.open\" v-for=\"branch in branches\" :data=\"branch\"></v-branch><v-leaf v-show=\"node.open\" v-for=\"leaf in leafs\" :data=\"leaf\"></ul>",
  name: 'v-branch',
  props: {
    data: Object
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

var VTreeComponent$1 = { template: "<ul class=\"branch\"><v-node :data=\"node\"></v-node><v-branch v-show=\"node.open\" v-for=\"branch in branches\" :data=\"branch\"></v-branch><v-leaf v-show=\"node.open\" v-for=\"leaf in leafs\" :data=\"leaf\"></v-leaf></ul>",
  name: 'v-tree-select',
  props: {
    data: Object,
    conf: Object
  },
  components: {
    'v-node': VNode,
    'v-leaf': VLeaf,
    'v-branch': VBranch
  },
  data: function data() {
    var store$$1 = new store(this.data, this.conf);

    return {
      store: store$$1,
      root: store$$1.dataStore
    };
  },
  computed: {
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

    this.__EVENT_BUS.$on('node_toggle_expanded', function (node) {
      node.open = !node.open;
    });

    this.__EVENT_BUS.$on('node_toggle_checked', function (node) {
      var branch = this$1.store.findCurrentBranch(node.level);
      var level  = branch.level;
      var nextState = !branch.node.checked;
      
      branch.node.checked = nextState;
      branch.branches.forEach(function (b) { return b.node.checked = nextState; });
      branch.leafs.forEach(function (l) { return l.checked = nextState; });

      this$1.store.checkAscendents(level, nextState);
      this$1.__EVENT_BUS.$emit('descendents_force_checked', branch.level, nextState);

      this$1.$nextTick(function () {
        this$1.$emit('change', this$1.store.getPathResult());
      });
    });

    this.__EVENT_BUS.$on('leaf_toggle_checked', function (leaf) {
      var nextState = !leaf.checked;
      leaf.checked = nextState;
      this$1.store.checkAscendents(leaf.level, nextState);
      
      this$1.$nextTick(function () {
        this$1.$emit('change', this$1.store.getPathResult());
      });
    });
  }
};

VTreeComponent$1.install = function (Vue) {
  // inject a eventbus
  Vue.prototype.__EVENT_BUS = new Vue();
  Vue.use(VBranch);
  Vue.component(VTreeComponent$1.name, VTreeComponent$1);
};
VBranch.install = function (Vue) {
  Vue.component(VBranch.name, VBranch);
};

return VTreeComponent$1;

})));
//# sourceMappingURL=bundle.js.map
