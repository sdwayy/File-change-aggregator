/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import path from 'path';
import {
  parseJsonFile,
  parseYamlFile,
  parseIniFile,
} from './parsers.js';
import getFormatter from './formatters/index.js';

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
    const firstValue = firstData[key];
    const secondValue = secondData[key];
    const valuesIsEqual = _.isEqual(firstValue, secondValue);

    const firstValueIsObject = _.isObject(firstValue);
    const secondValueIsObject = _.isObject(secondValue);

    const keyIsIncludedInFirstData = _.has(firstData, key);
    const keyIsIncludedInSecondData = _.has(secondData, key);

    if (firstValueIsObject && secondValueIsObject) {
      const type = '[complex value]';
      const node = { key, type, children: createTree(firstValue, secondValue) };

      return node;
    }

    if (valuesIsEqual) {
      const type = 'unmodifined';
      const node = { key, type, value: firstValue };

      return node;
    }

    if (keyIsIncludedInFirstData && keyIsIncludedInSecondData && !valuesIsEqual) {
      const type = 'updated';
      const node = {
        key, type, oldValue: firstValue, newValue: secondValue,
      };

      return node;
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

    return {};
  });
}

function genDiff(firstFilePath, secondFilePath, format) {
  const firstFileData = getFileData(firstFilePath);
  const secondFileData = getFileData(secondFilePath);
  const tree = createTree(firstFileData, secondFileData);
  const formatter = getFormatter(format);

  return formatter(tree);
}

export {
  genDiff,
  version,
  description,
};
