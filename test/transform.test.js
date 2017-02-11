import test from 'ava';
import { transform } from '../src/transform';

let data = {
  name: '--root',
  dirs: [{
    name: '--root-0',
    dirs: [{
      name: '--root-0-0',
      dirs: [],
      files: ['root.0.0.0']
    }, {
      name: '--root-0-1',
      dirs: [],
      files: ['root.0.1.0', 'root.0.1.1']
    }],
    files: ['root.0.0', 'root.0.1']
  }, {
    name: '--root-1',
    dirs: []
  }],
  files: [
    'root-0',
    'root-1',
    'root-2'
  ]
};

let ret = transform(data);

test('Function transform() works as expected', t => {
  t.truthy(ret);
  t.is(typeof ret, 'object');
  t.is(ret.name, '--root');
  t.is(ret.node.name, ret.name);
  t.is(ret.branches.length, data.dirs.length);
  t.is(ret.leafs.length, data.files.length);
});
