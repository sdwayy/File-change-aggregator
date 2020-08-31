import fs from 'fs';
import path from 'path';
import { test } from '@jest/globals';
import genDiff from '../src/index.js';

const filesNames = [
  [
    'before.json',
    'after.ini',
  ],
  [
    'before.yml',
    'after.json',
  ],
  [
    'before.ini',
    'after.yml',
  ],
];

const readFile = (filePath) => fs.readFileSync(filePath, 'utf-8');
const getFixturePath = (fileName) => path.join('__fixtures__', fileName);

test.each(filesNames)('genDiff for %s and %s with stylish formatter', (firstFileName, secondFileName) => {
  const firstFixturePath = getFixturePath(firstFileName);
  const secondFixturePath = getFixturePath(secondFileName);

  const expectedValue = genDiff(firstFixturePath, secondFixturePath);
  const toEqualValue = readFile('__fixtures__/stylishDiff.txt');

  expect(expectedValue).toEqual(toEqualValue);
});

test.each(filesNames)('genDiff for %s and %s with plain formatter', (firstFileName, secondFileName) => {
  const firstFixturePath = getFixturePath(firstFileName);
  const secondFixturePath = getFixturePath(secondFileName);

  const expectedValue = genDiff(firstFixturePath, secondFixturePath, 'plain');
  const toEqualValue = readFile('__fixtures__/plainDiff.txt');

  expect(expectedValue).toEqual(toEqualValue);
});

test.each(filesNames)('genDiff for %s and %s with json formatter', (firstFileName, secondFileName) => {
  const firstFixturePath = getFixturePath(firstFileName);
  const secondFixturePath = getFixturePath(secondFileName);

  const expectedValue = genDiff(firstFixturePath, secondFixturePath, 'json');
  const toEqualValue = readFile('__fixtures__/jsonDiff.txt');

  expect(expectedValue).toEqual(toEqualValue);
});
