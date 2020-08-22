import _ from 'lodash';

const formateValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
};

export default function formateToPlain(tree) {
  const diffs = [];

  const inner = (node, prefix = '') => {
    const {
      key, type, value, oldValue, newValue, children,
    } = node;

    const newPrefix = prefix ? `${prefix}.` : '';

    switch (type) {
      case 'added':
        diffs.push(`Property '${newPrefix}${key}' was added with value: ${formateValue(value)}`);
        break;
      case 'removed':
        diffs.push(`Property '${newPrefix}${key}' was removed`);
        break;
      case 'updated':
        diffs.push(`Property '${newPrefix}${key}' was updated. From ${formateValue(oldValue)} to ${formateValue(newValue)}`);
        break;
      case '[complex value]':
        children.forEach((child) => inner(child, `${newPrefix}${key}`));
        break;
      case 'unmodifined':
        break;
      default:
        throw new Error('Unknown node type');
    }
  };

  tree.forEach((node) => inner(node));

  diffs.sort((a, b) => {
    if (a > b) {
      return 1;
    }

    if (a < b) {
      return -1;
    }

    return 0;
  });

  return diffs.join('\n');
}
