import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const mapParser = {
  ini: (content) => {
    const parsedData = ini.parse(content);

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

  yml: (content) => yaml.safeLoad(content),

  json: (content) => JSON.parse(content),
};

export default function parse(content, format) {
  if (!mapParser[format]) {
    throw new Error(`This format is not supported: ${format}`);
  }

  return mapParser[format](content);
}
