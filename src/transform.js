/**
 * standardlize a normal tree object
 * 
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
const transform = (data = {}, conf = {}, level = '0', path = '') => {
  let newConf = Object.assign({}, conf, defaultConf);
  
  let { node, branch, leaf, checked, open } = newConf;
  let name = data[node] || '/';
  let branches = data[branch] || [];
  let leafs   = data[leaf] || [];
  let canOpen  = branches.length > 0 || leafs.length > 0;

  branches = branches.map((branch, i) => {
    return transform(branch, newConf, `${level}.${i}`, `${path}/${branch.name}`);
  });
  
  leafs = leafs.map((leaf, i) => {
    return {
      checked,
      name: leaf,
      level: `${level}.${i}`,
      path: `${path}/${leaf}`
    };
  });

  return {
    name,
    level,
    path,
    node: { name, open, canOpen, checked, level },
    branches,
    leafs
  };
};

const defaultConf = {
  node: 'name',
  branch: 'dirs',
  leaf: 'files',
  open: false,
  checked: false
};

module.exports = {
  transform,
  defaultConf
};
