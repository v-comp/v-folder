const objectAssign = require('object-assign');
const { transform, defaultConf } = require('../src/transform');
const arrPush = [].push;

module.exports = class Store {
  constructor(data, conf) {
    this.dataStore = this.setStore(data, conf);
  }

  /**
   * set data store
   */
  setStore(data = {}, conf = defaultConf) {
    return (this.dataStore = transform(data, conf));
  }

  /**
   * get parent branch by levelId.
   * result for a leaf is the branch it is on,
   * for a branch,  result is it's parent branch.
   * 
   * @param levelId
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
  }

  /**
   * get current branch
   * 
   * @param levelId 
   */
  findCurrentBranch(levelId = '') {
    let lvs    = levelId.split('.').slice(1);
    let index  = 0;
    let branch = this.dataStore;

    while (branch && (index = lvs.shift())) {
      branch = branch.branches[index];
    }

    return branch;
  }

  /**
   * @param data     replace empty branch
   * @param levelId  inditifying where to replace
   * @param conf     contains keys to extract data from `data` 
   */
  replaceBranch(data, levelId = '0', conf = defaultConf) {
    let lvs    = levelId.split('.').slice(1);
    let index  = 0;
    let clone  = objectAssign({}, this.dataStore);
    let parent = clone;
    let replacePos = lvs.pop();

    while (parent && (index = lvs.shift())) {
      parent = parent.branches[index];
    }

    parent.branches[replacePos] = transform(data, conf, levelId);

    return (this.dataStore = clone);
  }

  /**
   * check ascendents of certain level rescursively
   * to see if they should get checked
   * 
   * @param level    the descendent levelId
   * @param checked  if the descendent is checked
   */
  checkAscendents(level, checked) {
    let branch = this.findParentBranch(level);
    let nextStatus = false;

    if (branch) {
      if (checked) {
        let allBranchesChecked = !branch.branches.some(b => !b.node.checked);
        let allLeavesChecked   = !branch.leafs.some(l => !l.checked);
        nextStatus = allBranchesChecked && allLeavesChecked;
      }

      branch.node.checked = nextStatus;
      this.checkAscendents(branch.level, nextStatus);
    }
  }

  /**
   * get result as path
   */
  getPathResult(branch) {
    branch = branch || this.dataStore;

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
        arrPush.apply(result, this.getPathResult(branch))
      });
    }

    return result;
  }
};
