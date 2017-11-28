/**
 * standardlize a normal tree object
 *
 * @param data   data to be transformed
 * @param conf   contains keys to extract data from `data`
 * @param level  identifier inferring depth
 */
export default transform

function transform (data = {}, config, level, path = '') {
  path = path.replace(/^\s*\/+/, '/')
  let { node, branch, leaf, check, open } = config
  let name = data[node] || '/'
  let branches = data[branch] || []
  let leafs = data[leaf] || []
  let canOpen = branches.length > 0 || leafs.length > 0

  if (!path) {
    path = name === '/' ? name : `/${name}`
  }

  branches = branches.map((item, i) => {
    if (typeof item === 'string') {
      let o = {}
      o[node] = item
      item = o
    }

    return transform(item, config, `${level}.${i}`, `${path}/${item[node]}`)
  })

  leafs = leafs.map((leaf, i) => {
    return {
      name: leaf,
      type: 'leaf',
      check,
      level: `${level}.${i}`,
      path: `${path}/${leaf}`
    }
  })

  let status = canOpen ? 'filled' : 'empty'

  return {
    name,
    type: 'branch',
    level,
    path,
    node: { name, open: +level === 0 || open, canOpen, check, level, path, type: 'node', status },
    branches,
    leafs
  }
};
