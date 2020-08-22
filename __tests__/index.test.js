import { genDiff } from '../src/index.js';
import readFile from '../src/util.js';

const jsonDiff = readFile('../__fixtures__/jsonDiff.txt');
const plainDiff = readFile('../__fixtures__/plainDiff.txt');
const stylishDiff = readFile('../__fixtures__/stylishDiff.txt');

test('genDiff', () => {
  expect(genDiff(
    '../__fixtures__/before.json',
    '../__fixtures__/after.ini',
  )).toEqual(stylishDiff);
  expect(genDiff(
    '../__fixtures__/before.yml',
    '../__fixtures__/after.json',
    'plain',
  )).toEqual(plainDiff);
  expect(genDiff(
    '../__fixtures__/before.ini',
    '../__fixtures__/after.yml',
    'json',
  )).toEqual(jsonDiff);
});
