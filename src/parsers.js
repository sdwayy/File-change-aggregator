/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

export default function parseFileData(fileData, fileExtanstion = '.json') {
  const parser = {
    '.ini': function parseIniFile() {
      const parsedData = ini.parse(fileData);

      const getFormatedData = (data) => {
        const result = {};
        const entries = Object.entries(data);

        entries.forEach(([key, value]) => {
          if (_.isObject(value)) {
            result[key] = getFormatedData(value);

            return;
          }

          const parsedValue = parseInt(value, 10) ? parseInt(value, 10) : value;

          result[key] = parsedValue;
        });

        return result;
      };

      return getFormatedData(parsedData);
    },

    '.yml': function parseYamlFile() {
      return yaml.safeLoad(fileData);
    },

    '.json': function parseJsonFile() {
      return JSON.parse(fileData);
    },
  };

  if (!parser[fileExtanstion]) {
    throw new Error(`${fileExtanstion} is not supported`);
  }

  return parser[fileExtanstion]();
}
