/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import path from 'path';
import {
  parseJsonFile,
  parseYamlFile,
  parseIniFile,
} from './parsers.js';
import stylish from './formatters/stylish.js';
import plain from './formatters/plain.js';

const packageJsonData = parseJsonFile('../package.json');
const { version, description } = packageJsonData;

function getFileData(filePath) {
  const fileType = path.extname(filePath);

  switch (fileType) {
    case '.yml':
      return parseYamlFile(filePath);
    case '.ini':
      return parseIniFile(filePath);
    default:
      return parseJsonFile(filePath);
  }
}

function createTree(firstData, secondData) {
  const keysInFirstData = Object.keys(firstData);
  const keysInSecondData = Object.keys(secondData);
  const uniqKeys = _.uniq([...keysInFirstData, ...keysInSecondData]);

  return uniqKeys.map((key) => {
    const valueInFirstData = firstData[key];
    const valueInSecondData = secondData[key];
    const valuesIsEqual = _.isEqual(valueInFirstData, valueInSecondData);

    const valueInFirstDataIsObject = _.isObject(valueInFirstData);
    const valueInSecondDataIsObject = _.isObject(valueInSecondData);

    const keyIsIncludedInFirstData = _.has(firstData, key);
    const keyIsIncludedInSecondData = _.has(secondData, key);

    if (valueInFirstDataIsObject && valueInSecondDataIsObject) {
      const type = 'nested';
      const node = { key, type, children: createTree(valueInFirstData, valueInSecondData) };

      return node;
    }

    if (valuesIsEqual) {
      const type = 'unmodifined';
      const node = { key, type, value: valueInFirstData };

      return node;
    }

    if (keyIsIncludedInFirstData && keyIsIncludedInSecondData && !valuesIsEqual) {
      const type = 'updated';
      const node = {
        key, type, oldValue: valueInFirstData, newValue: valueInSecondData,
      };

      return node;
    }

    if (keyIsIncludedInFirstData && !keyIsIncludedInSecondData) {
      const type = 'removed';
      const node = { key, type, value: valueInFirstData };

      return node;
    }

    if (!keyIsIncludedInFirstData && keyIsIncludedInSecondData) {
      const type = 'added';
      const node = { key, type, value: valueInSecondData };

      return node;
    }

    return {};
  });
}

function genDiff(firstFilePath, secondFilePath, formatter = stylish) {
  const firstFileData = getFileData(firstFilePath);
  const secondFileData = getFileData(secondFilePath);
  const tree = createTree(firstFileData, secondFileData);

  return formatter(tree);
}

export {
  genDiff,
  version,
  description,
};

// console.log(genDiff('../__fixtures__/flatBefore1.json', '../__fixtures__/flatBefore2.json', plain));
console.log(genDiff('../__fixtures__/nestedBefore1.json', '../__fixtures__/nestedBefore2.json', plain));
