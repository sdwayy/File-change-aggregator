/* eslint-disable no-underscore-dangle */

import path from 'path';
import { fileURLToPath } from 'url';
import program from 'commander';
import {
  parseFileToJson,
  getJsonDiff,
} from './parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJson = parseFileToJson(__dirname, '../package.json');
const { version, description } = packageJson;

const genDiff = (firstFilePath, secondFilePath) => {
  const firstFileData = parseFileToJson(__dirname, firstFilePath);
  const secondFileData = parseFileToJson(__dirname, secondFilePath);

  return getJsonDiff(firstFileData, secondFileData);
};

program
  .description(`${description}`)
  .version(version)
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2));
  });

program.parse(process.argv);

export {
  genDiff,
  program,
};
