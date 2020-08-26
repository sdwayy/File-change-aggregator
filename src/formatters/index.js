import jsonFormatter from './json.js';
import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

export default function getFormatter(format = 'stylish') {
  const formatter = {
    plain: plainFormatter,
    json: jsonFormatter,
    stylish: stylishFormatter,
  };

  if (!formatter[format]) {
    throw new Error('Unknown format');
  }

  return formatter[format];
}
