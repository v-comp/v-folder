const { transform, defaultConf } = require('../src/transform');
const arrPush = [].push;

module.exports = {
  dataStore: transform({}),

  /**
   * 设置初始数据
   */
  setStore(data, conf = defaultConf) {
    return (this.dataStore = transform(data, conf));
  },

  /**
   * get parent branch
   */
  findParentBranch(levelId = '') {
    let length = levelId.length;
    let branch = this.dataStore;

    if (length <= 1) {
      return null;
    }
    
    let lvs    = levelId.split('.').slice(1, -1);
    let index  = 0;

    while (branch && (index = lvs.shift())) {
      branch = branch.branches[index];
    }

    return branch;
  },

  /**
   * get current branch
   */
  findCurrentBranch(levelId = '') {
    let lvs    = levelId.split('.').slice(1);
    let index  = 0;
    let branch = this.dataStore;

    while (branch && (index = lvs.shift())) {
      branch = branch.branches[index];
    }

    return branch;
  },

  /**
   * @param data     replace empty branch
   * @param levelId  inditifying where to replace
   * @param conf     contains keys to extract data from `data` 
   */
  replaceBranch(data, levelId = '0', conf = defaultConf) {
    let lvs    = levelId.split('.').slice(1);
    let index  = 0;
    let clone  = Object.assign({}, this.dataStore);
    let parent = clone;
    let replacePos = lvs.pop();

    while (parent && (index = lvs.shift())) {
      parent = parent.branches[index];
    }

    parent.branches[replacePos] = transform(data, conf, levelId);

    return (this.dataStore = clone);
  },

  getBranchResult(branch) {
    let result = [];
    let { node, branches, leafs, path } = branch;

    if (node.checked) {
      result.push(branch.path);
    } else {
      leafs.forEach(({ checked, path }) => {
        if (checked) {
          result.push(path);
        }
      });

      branches.forEach(branch => {
        arrPush.apply(result, this.getBranchResult(branch))
      });
    }

    return result;
  },

  getResult() {
    return this.getBranchResult(this.dataStore)
  }
};
