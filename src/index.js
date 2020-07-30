import _ from 'lodash';
import parseJson from './parsers.js';

export default function genDiff(firstFilePath, secondFilePath) {
  const firstFileData = parseJson(firstFilePath);
  const secondFileData = parseJson(secondFilePath);

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
      result += `   ${key}: ${firstDataValue}\n`;
    } else if (_.has(secondFileData, key)
              && key !== secondDataValue) {
      const oldValue = `${key}: ${firstDataValue}`;
      const newValue = `${key}: ${secondDataValue}`;

      result += ` - ${oldValue}\n + ${newValue}\n`;
    } else {
      result += ` - ${key}: ${firstDataValue}\n`;
    }
  });

  // Проверяем содержит ли второй объект новые ключи
  secondFileDataEntries.forEach(([key, value]) => {
    if (!_.has(firstFileData, key)) {
      result += ` + ${key}: ${value}`;
    }
  });

  const resultStrings = result.split('\n');
  const sorteredResultStrings = resultStrings.sort((a, b) => {
    const firstAletter = a[3];
    const firstBletter = b[3];

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

// console.log(genDiff('./../example/file1.json', './../example/file2.json'));
