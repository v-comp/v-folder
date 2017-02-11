import test from 'ava';
import store from '../src/store';
import { transform } from '../src/transform';

let mock = {
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
    dirs: [{
      name: '--root-1-0',
      dirs: [{
        name: '--root-1.0.0 TEST HERE',
        dirs: [],
        files: []
      }],
      files: []
    }],
    files: []
  }
  ],
  files: [
    'root-0',
    'root-1',
    'root-2'
  ]
};

let data = null;

test.beforeEach(t => {
  data = store.setStore(mock);
});

test('test store.setStore', t => {
  let keys = ['name', 'level', 'path', 'node', 'branches', 'leafs'].sort();
  t.deepEqual(Object.keys(data).sort(), keys);
});

test('test store.replaceBranch', t => {
  let newData = {
    name: '--root-1.0.0 TEST HERE',
    dirs: [{
      name: 'test',
      dirs: [],
      files: ['root.1.0.0.0.0']
    }],
    files: ['root.1.0.0.0']
  };

  data = store.replaceBranch(newData, '0.1.0.0');
  let replaced = data.branches[1].branches[0].branches[0];
  let transformed = transform(newData, null, '0.1.0.0');

  // console.log(JSON.stringify(data, null, 2));
  t.deepEqual(replaced, transformed);
});

test('test store.findParentBranch', t => {
  let branch = store.findParentBranch('0.0.1.0');
  // console.log(branch);
  t.is(branch.name, '--root-0-1');
});

test('test store.findCurrentBranch', t => {
  let branch = store.findCurrentBranch('0.0.1');
  // console.log(branch);
  t.is(branch.name, '--root-0-1');
});
