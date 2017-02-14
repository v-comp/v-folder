import objectAssign from 'object-assign';

/**
 * standardlize a normal tree object
 * 
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
export default transform;

function transform(data = {}, config, level, path) {
  let { node, branch, leaf, check, open } = config;
  let name = data[node] || '/';
  let branches = data[branch] || [];
  let leafs   = data[leaf] || [];
  let canOpen  = branches.length > 0 || leafs.length > 0;

  path = path || `/${name}`;
  
  branches = branches.map((branch, i) => {
    return transform(branch, config, `${level}.${i}`, `${path}/${branch.name}`);
  });
  
  leafs = leafs.map((leaf, i) => {
    return {
      name: leaf,
      type: 'leaf',
      check,
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
    node: { name, open, canOpen, check, level, path, type: 'node', status },
    branches,
    leafs,
  };
};

// function raw(tree, conf) {
//   conf = objectAssign({}, conf, defaultConf);
//   let { node, branch, leaf } = conf;
//   let ret = {};
//   ret[node] = tree.name;
//   ret[branch] = tree.branches.map(b => raw(b, conf));
//   ret[leaf] = tree.leafs.map(l => l.name);
//   return ret;
// }

// transform.raw = raw;
