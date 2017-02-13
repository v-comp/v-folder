import objectAssign from 'object-assign';

/**
 * standardlize a normal tree object
 * 
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
export default transform;

function transform(data = {}, conf = {}, level = '0', path) {
  let newConf = objectAssign({}, conf, {
    node: 'name',
    branch: 'dirs',
    leaf: 'files',
    open: false,
    checked: false
  });
  
  let { node, branch, leaf, checked, open } = newConf;
  let name = data[node] || '/';
  let branches = data[branch] || [];
  let leafs   = data[leaf] || [];
  let canOpen  = branches.length > 0 || leafs.length > 0;
  
  path = path || `/${name}`;
  branches = branches.map((branch, i) => {
    return transform(branch, newConf, `${level}.${i}`, `${path}/${branch.name}`);
  });
  
  leafs = leafs.map((leaf, i) => {
    return {
      name: leaf,
      type: 'leaf',
      checked,
      level: `${level}.${i}`,
      path: `${path}/${leaf}`
    };
  });

  let status = canOpen ? 'filled' : 'empty';

  return {
    name,
    type: 'branch',
    level,
    path,
    node: { name, open, canOpen, checked, level, path, type: 'node', status },
    branches,
    leafs,
  };
};
