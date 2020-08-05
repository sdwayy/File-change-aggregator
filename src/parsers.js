/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = (inputPath) => fs.readFileSync(path.resolve(__dirname, inputPath), 'utf8');
const parseJsonFile = (inputPath) => JSON.parse(readFile(inputPath));
const parseYamlFile = (inputPath) => yaml.safeLoad(readFile(inputPath));

export {
  parseJsonFile,
  parseYamlFile,
};
