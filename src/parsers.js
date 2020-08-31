/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const mapParser = {
  ini: (fileContent) => {
    const parsedData = ini.parse(fileContent);

    const getFormatedData = (data) => {
      const result = {};
      const entries = Object.entries(data);

      entries.forEach(([key, value]) => {
        if (_.isObject(value)) {
          result[key] = getFormatedData(value);

          return;
        }

        const parsedValue = _.isString(value) && Number(value)
          ? Number(value) : value;

        result[key] = parsedValue;
      });

      return result;
    };

    return getFormatedData(parsedData);
  },

  yml: (fileContent) => yaml.safeLoad(fileContent),

  json: (fileContent) => JSON.parse(fileContent),
};

export default function parse(fileContent, format) {
  if (!mapParser[format]) {
    throw new Error(`This format is not supported: ${format}`);
  }

  return mapParser[format](fileContent);
}
