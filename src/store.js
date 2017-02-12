const objectAssign = require('object-assign');
const { transform, defaultConf } = require('../src/transform');
const arrPush = [].push;

module.exports = class Store {
  constructor(data, conf) {
    this.dataStore = this.setStore(data, conf);
  }

  /**
   * set data store
   * @private
   */
  setStore(data = {}, conf = defaultConf) {
    return (this.dataStore = transform(data, conf));
  }

  /**
   * get parent branch by levelId.
   * result for a leaf is the branch it is on,
   * for a branch,  result is it's parent branch.
   * 
   * @private
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
   * @private
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
   * check ascendents of certain level rescursively
   * to see if they should get checked
   * 
   * @private
   * @param branch    the descendent branch
   * @param checked  if the descendent is checked
   */
  checkBranchAscendents(branch, checked) {
    let nextStatus = false;

    if (branch) {
      if (checked) {
        let allBranchesChecked = !branch.branches.some(b => !b.node.checked);
        let allLeavesChecked   = !branch.leafs.some(l => !l.checked);
        nextStatus = allBranchesChecked && allLeavesChecked;
      }

      branch.node.checked = nextStatus;
      this.checkBranchAscendents(this.findParentBranch(branch.level), nextStatus);
    }
  }

  /**
   * check branch children and decendents.
   * if node is checked, all children are checked too and vice versa.
   *
   * @private
   * @param branch   current descendent branch
   * @param checked  if the ascendent is checked
   */
  checkBranchDescendents(branch, checked) {
    branch.node.checked = checked;
    branch.leafs.forEach(l => l.checked = checked);
    branch.branches.forEach(b => {
      b.node.checked = checked;
      this.checkBranchDescendents(b, checked);
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
  checkNode(node) {
    let branch = this.findCurrentBranch(node.level);
    let nextState = !branch.node.checked;
    this.checkBranchDescendents(branch, nextState);
    this.checkBranchAscendents(this.findParentBranch(branch.level), nextState);
  }

  /**
   * check if a node should expand
   * 
   * @param node  node of a branch
   */
  expandNode(node) {
    node.open = !node.open;
  }
  
  /**
   * if a leaf is checked,
   * we have to check all its ascendents
   * to see if any should get checked to.
   * 
   * @param leaf
   */
  checkLeaf(leaf) {
    let leafBranch = this.findParentBranch(leaf.level);
    let nextState = !leaf.checked;
    leaf.checked = nextState;
    this.checkBranchAscendents(leafBranch, nextState);
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
