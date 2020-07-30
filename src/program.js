import path from 'path';
import program from 'commander';
import parseJson from './parsers.js';
import genDiff from './index.js';

const packageJson = parseJson(path.resolve('.', 'package.json'));

const { version, description } = packageJson;

program
  .description(`${description}`)
  .version(version)
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2));
  });

program.parse(process.argv);

export default program;
