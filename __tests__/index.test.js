import { genDiff } from '../src/index.js';
import flatAfter from '../__fixtures__/flatAfter.js';
import nestedAfter from '../__fixtures__/nestedAfter.js';

test('genDiff', () => {
  expect(genDiff(
    '../__fixtures__/flatBefore1.json',
    '../__fixtures__/flatBefore2.json',
  )).toEqual(flatAfter);
  expect(genDiff(
    '../__fixtures__/flatBefore1.yml',
    '../__fixtures__/flatBefore2.yml',
  )).toEqual(flatAfter);
  expect(genDiff(
    '../__fixtures__/flatBefore1.ini',
    '../__fixtures__/flatBefore2.ini',
  )).toEqual(flatAfter);
  expect(genDiff(
    '../__fixtures__/nestedStructure1.json',
    '../__fixtures__/nestedStructure2.json',
  )).toEqual(nestedAfter);
});
