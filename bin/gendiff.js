#!/usr/bin/env node
import { program } from 'commander';
import {
  version,
  description,
  genDiff,
} from '../src/index.js';

program
  .description(`${description}`)
  .version(version)
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2) => {
    console.log(genDiff(filepath1, filepath2));
  });

program.parse(process.argv);
