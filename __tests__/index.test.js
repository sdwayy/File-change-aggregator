import { test } from '@jest/globals';
import { genDiff } from '../src/index.js';
import readFile from '../src/util.js';

const paths = [
  [
    '../__fixtures__/before.json',
    '../__fixtures__/after.ini',
  ],
  [
    '../__fixtures__/before.yml',
    '../__fixtures__/after.json',
  ],
  [
    '../__fixtures__/before.ini',
    '../__fixtures__/after.yml',
  ],
];

test.each(paths)('genDiff -f stylish', (firstFilePath, secondFilePath) => {
  const expectedValue = genDiff(firstFilePath, secondFilePath);
  const toEqualValue = readFile('../__fixtures__/stylishDiff.txt');

  expect(expectedValue).toEqual(toEqualValue);
});

test.each(paths)('genDiff -f plain', (firstFilePath, secondFilePath) => {
  const expectedValue = genDiff(firstFilePath, secondFilePath, 'plain');
  const toEqualValue = readFile('../__fixtures__/plainDiff.txt');

  expect(expectedValue).toEqual(toEqualValue);
});

test.each(paths)('genDiff -f json', (firstFilePath, secondFilePath) => {
  const expectedValue = genDiff(firstFilePath, secondFilePath, 'json');
  const toEqualValue = readFile('../__fixtures__/jsonDiff.txt');

  expect(expectedValue).toEqual(toEqualValue);
});
