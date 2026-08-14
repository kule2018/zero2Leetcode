const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const batchPath = path.join(root, 'assets/js/playground-extra/batch-4.js');

function loadBatchProblems() {
  const context = {
    window: {},
    document: { readyState: 'loading' },
    BINARY_TREE_SETUP: '',
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(batchPath, 'utf8'), context, { filename: batchPath });
  return context.window.PLAYGROUND_EXTRA_PROBLEMS || [];
}

test('LeetCode 4 is wired to the local playground with executable test cases', () => {
  const problem = loadBatchProblems().find((item) => item.id === 4);

  assert.ok(problem, 'LC 4 must have a detailed local playground configuration');
  assert.equal(problem.functionName, 'find_median_sorted_arrays');
  assert.match(problem.template, /def find_median_sorted_arrays\(nums1, nums2\):/);
  assert.equal(problem.isFallback, undefined);
  assert.ok(Array.isArray(problem.testCases) && problem.testCases.length >= 4);
  assert.deepEqual(
    JSON.parse(JSON.stringify(problem.testCases[0])),
    { input: [[1, 3], [2]], expected: 2.0 },
  );
  assert.ok(problem.testCases.some(({ input }) => input[0].length === 0 || input[1].length === 0));
});
