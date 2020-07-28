import path from 'path';
import program from 'commander';
import parseJson from './parsers.js';

const packageJson = parseJson(path.resolve('.', 'package.json'));
const { version, description } = packageJson;
const usage = '[options] <filepath1> <filepath2>';

export default program
  .usage(usage)
  .description(`${description}`)
  .version(version)
  .option('-f, --format [type]', 'output format')
  .parse(process.argv);
