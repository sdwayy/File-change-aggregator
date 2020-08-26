/* eslint-disable no-underscore-dangle */
import path from 'path';
import _ from 'lodash';
import parseFileData from './parsers.js';
import readFile from './util.js';
import getFormatter from './formatters/index.js';

const packageJsonFileData = readFile('../package.json');
const parsedPackageJsonFileData = parseFileData(packageJsonFileData);
const { version, description } = parsedPackageJsonFileData;

function createTree(firstData, secondData) {
  const keysInFirstData = Object.keys(firstData);
  const keysInSecondData = Object.keys(secondData);
  const uniqKeys = _.union(keysInFirstData, keysInSecondData);

  return uniqKeys.map((key) => {
    const firstValue = firstData[key];
    const secondValue = secondData[key];

    const keyIsIncludedInFirstData = _.has(firstData, key);
    const keyIsIncludedInSecondData = _.has(secondData, key);

    if (keyIsIncludedInFirstData && keyIsIncludedInSecondData) {
      const valuesIsEqual = firstValue === secondValue;

      const firstValueIsObject = _.isObject(firstValue);
      const secondValueIsObject = _.isObject(secondValue);

      if (firstValueIsObject && secondValueIsObject) {
        const type = 'nested';
        const node = { key, type, children: createTree(firstValue, secondValue) };

        return node;
      }

      if (valuesIsEqual) {
        const type = 'unmodifined';
        const node = { key, type, value: firstValue };

        return node;
      }

      if (!valuesIsEqual) {
        const type = 'updated';
        const node = {
          key, type, oldValue: firstValue, newValue: secondValue,
        };

        return node;
      }
    }

    if (keyIsIncludedInFirstData && !keyIsIncludedInSecondData) {
      const type = 'removed';
      const node = { key, type, value: firstValue };

      return node;
    }

    if (!keyIsIncludedInFirstData && keyIsIncludedInSecondData) {
      const type = 'added';
      const node = { key, type, value: secondValue };

      return node;
    }

    throw new Error('Unknown type');
  });
}

function genDiff(firstFilePath, secondFilePath, format) {
  const firstFileExtansion = path.extname(firstFilePath);
  const secondFileExtansion = path.extname(secondFilePath);

  const firstFileData = readFile(firstFilePath);
  const secondFileData = readFile(secondFilePath);

  const parsedFirstFileData = parseFileData(firstFileData, firstFileExtansion);
  const parsedSecondFileData = parseFileData(secondFileData, secondFileExtansion);

  const tree = createTree(parsedFirstFileData, parsedSecondFileData);
  const formatter = getFormatter(format);

  return formatter(tree);
}

export {
  genDiff,
  version,
  description,
};
