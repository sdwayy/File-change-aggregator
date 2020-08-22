/* eslint-disable no-underscore-dangle */
import yaml from 'js-yaml';
import ini from 'ini';
import readFile from './util.js';

const parseJsonFile = (inputPath) => JSON.parse(readFile(inputPath));
const parseYamlFile = (inputPath) => yaml.safeLoad(readFile(inputPath));
const parseIniFile = (inputPath) => ini.parse(readFile(inputPath));

export {
  parseJsonFile,
  parseYamlFile,
  parseIniFile,
};
