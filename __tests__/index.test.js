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
  expect(genDiff('../__fixtures__/file1.json', '../__fixtures__/file2.json'))
    .toEqual(сorrectResult);
  expect(genDiff('../__fixtures__/file1.yml', '../__fixtures__/file2.yml'))
    .toEqual(сorrectResult);
  expect(genDiff('../__fixtures__/file1.ini', '../__fixtures__/file2.ini'))
    .toEqual(сorrectResult);
});
