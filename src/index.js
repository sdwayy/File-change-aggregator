/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import path from 'path';
import program from 'commander';
import {
  parseJsonFile,
  parseYamlFile,
  parseIniFile,
} from './parsers.js';

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

function genDiff(firstFilePath, secondFilePath) {
  const firstFileData = getFileData(firstFilePath);
  const secondFileData = getFileData(secondFilePath);

  if (_.isEqual(firstFileData, secondFileData)) {
    return firstFileData;
  }

  const firstFileDataEntries = Object.entries(firstFileData);
  const secondFileDataEntries = Object.entries(secondFileData);

  let result = '';

  // Проверяем первый объект на изменения
  firstFileDataEntries.forEach(([key, value]) => {
    const secondDataValue = secondFileData[key];

    if (_.has(secondFileData, key)
        && value === secondDataValue) {
      result += `    ${key}: ${value}\n`;
    } else if (_.has(secondFileData, key)
              && key !== secondDataValue) {
      const oldValue = `${key}: ${value}`;
      const newValue = `${key}: ${secondDataValue}`;

      result += `  - ${oldValue}\n  + ${newValue}\n`;
    } else {
      result += `  - ${key}: ${value}\n`;
    }
  });

  // Проверяем содержит ли второй объект новые ключи
  secondFileDataEntries.forEach(([key, value]) => {
    if (!_.has(firstFileData, key)) {
      result += `  + ${key}: ${value}`;
    }
  });

  const resultStrings = result.split('\n');
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
}

program
  .description(`${description}`)
  .version(version)
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2));
  });

export {
  genDiff,
  program,
};
