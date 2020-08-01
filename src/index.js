import path from 'path';
import program from 'commander';
import {
  parseFileToJson,
  getJsonDiff,
} from './parsers.js';

const packageJson = parseFileToJson(path.resolve('.', 'package.json'));

const { version, description } = packageJson;

const genDiff = (firstFilePath, secondFilePath, type = 'json') => {
  const firstFileData = parseFileToJson(firstFilePath);
  const secondFileData = parseFileToJson(secondFilePath);

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
