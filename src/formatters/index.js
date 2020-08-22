import formateToJson from './json.js';
import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

export default function getFormatter(format) {
  const formatter = {
    plain: plainFormatter,
    json: formateToJson,
    stylish: stylishFormatter,
  };

  if (!format) {
    return formatter.stylish;
  }

  return formatter[format];
}
