import { genDiff } from '../src/index.js';

const сorrectResult = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('genDiff', () => {
  expect(genDiff('../__fixtures__/file1.json', '../__fixtures__/file2.json')).toEqual(сorrectResult);
});
