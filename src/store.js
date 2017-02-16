import objectAssign from './utils/object-assign';
import deepClone from './utils/deepCopy';
import transform from './transform';

const arrPush = [].push;
const defaultConf = {
  node: 'name',
  branch: 'dirs',
  leaf: 'files',
  open: false,
  check: -1
};

export default class Store {
  constructor(data, conf) {
    this.conf = objectAssign({}, defaultConf, conf);
    let path = data.path || data[this.conf.node] || '/';
    let name = path.split('/').filter(s => !!s).slice(-1)[0] || data.name;
    data.name = name;
    this.dataStore = transform(data, this.conf, '0', path);
  }

  /**
   * set data store
   * @private
   */
  replace(newTree) {
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
   * this is a passive ation
   * 
   * @private
   * @param branch    the descendent branch
   * @param check     the descendent's check status
   */
  checkBranchAscendents(branch, check) {
    if (!branch) return;

    let { branches, leafs, node, level } = branch;
    let nextStatus = 0;

    switch (check) {
      case 1:
        // at least nextStatus will be zero,
        // so let's see if all children checked
        let branchesAllChecked = !branches.length || !branches.some(b => b.node.check < 1);
        let leafsAllChecked = !leafs.length || !leafs.some(f => f.check < 1);
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
        let branchesAllUnchecked = !branches.length || !branches.some(b => b.node.check > -1);
        let leafsAllUnChecked = !leafs.length || !leafs.some(f => f.check > -1);
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
  checkBranchDescendents(branch, check) {
    branch.node.check = check;
    if (!check) return;
    branch.leafs.forEach(l => l.check = check);
    branch.branches.forEach(b => {
      b.node.check = check;
      this.checkBranchDescendents(b, check);
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
    // node.check: -1(unchecked) 0(imtermedite) 1(checked)
    // 0 -> 1 (and state 0 is passive)
    // 1 <=> -1
    let branch = this.findCurrentBranch(node.level);
    let checkState = branch.node.check;
    let nextState = checkState < 1 ? 1 : -1;
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
  checkLeaf(leaf) {
    let leafBranch = this.findParentBranch(leaf.level);
    let nextState = -1 * leaf.check;
    leaf.check = nextState;
    this.checkBranchAscendents(leafBranch, nextState);
  }

   /**
    * merge a branch to current tree
    * @param branch
    */
  merge(
    data = {},
    node = {
      level: '0',
      path: ''
    }
  ) {
    let { level, path, check } = node;
    let lvs = level.split('.').slice(1);
    let branch = transform(data, this.conf, level, path);

    branch.node.open = true;
    branch.node.check = check;
    branch.node.status = 'done';

    if (lvs.length === 0) {
      this.replace(branch);
    } else {
      let clone = deepClone(this.dataStore);
      let top   = clone;
      let pos   = lvs.pop();
      let index = 0;

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
  commit(action, elem) {
    return new Promise((resolve, reject) => {
      let isNode = elem.type === 'node';
      
      if (action === 'change') {
          this[isNode ? 'checkNode' : 'checkLeaf'](elem);
          return resolve(this.getPathResult());
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
  getPathResult(branch) {
    branch = branch || this.dataStore;

    let result = [];
    let { node, branches, leafs, path } = branch;

    if (node.check > 0) {
      result.push(branch.path);
    } else {
      leafs.forEach(({ check, path }) => {
        if (check > 0) {
          result.push(path);
        }
      });

      branches.forEach(branch => {
        arrPush.apply(result, this.getPathResult(branch))
      });
    }

    return result;
  }

  raw() {
    return transform.raw(this.dataStore, this.conf);
  }
};
