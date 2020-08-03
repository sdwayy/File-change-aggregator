/* eslint-disable no-underscore-dangle */

import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const parseFileToJson = (base, inputPath) => JSON.parse(fs.readFileSync(path.resolve(base, inputPath), 'utf8'));

const getJsonDiff = (firstFileData, secondFileData) => {
  if (_.isEqual(firstFileData, secondFileData)) {
    return JSON.stringify(firstFileData);
  }

  const firstFileDataKeys = Object.keys(firstFileData);
  const secondFileDataEntries = Object.entries(secondFileData);

  let result = '';

  // Проверяем первый объект на изменения
  firstFileDataKeys.forEach((key) => {
    const firstDataValue = firstFileData[key];
    const secondDataValue = secondFileData[key];

    if (_.has(secondFileData, key)
        && firstDataValue === secondDataValue) {
      result += `    ${key}: ${firstDataValue}\n`;
    } else if (_.has(secondFileData, key)
              && key !== secondDataValue) {
      const oldValue = `${key}: ${firstDataValue}`;
      const newValue = `${key}: ${secondDataValue}`;

      result += `  - ${oldValue}\n  + ${newValue}\n`;
    } else {
      result += `  - ${key}: ${firstDataValue}\n`;
    }
  });

  // Проверяем содержит ли второй объект новые ключи
  secondFileDataEntries.forEach(([key, value]) => {
    if (!_.has(firstFileData, key)) {
      result += `  + ${key}: ${value}`;
    }
  });

  const resultStrings = result.split('\n');
  console.log('resultStrings: ', resultStrings);
  const sorteredResultStrings = resultStrings.sort((a, b) => {
    const regExp = /(\w\S\D)/;
    const firstAletter = a[a.search(regExp)];
    const firstBletter = b[b.search(regExp)];

    if (firstAletter > firstBletter) {
      return 1;
    }

    if (firstAletter < firstBletter) {
      return -1;
    }

    return 0;
  });

  return `{\n${sorteredResultStrings.join('\n')}\n}`;
};

export {
  parseFileToJson,
  getJsonDiff,
};
