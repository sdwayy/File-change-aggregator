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
  const inner = (node, prefix = '') => {
    const {
      key, type, value, children,
    } = node;

    const newPrefix = prefix ? `${prefix}.` : '';

    switch (type) {
      case 'added':
        return `Property '${newPrefix}${key}' was added with value: ${formateValue(value)}`;
      case 'removed':
        return `Property '${newPrefix}${key}' was removed`;
      case 'updated':
        return `Property '${newPrefix}${key}' was updated. From ${formateValue(value.oldValue)} to ${formateValue(value.newValue)}`;
      case 'nested':
        return children.flatMap((child) => inner(child, `${newPrefix}${key}`));
      default:
        return [];
    }
  };

  const result = tree
    .flatMap((node) => inner(node))
    .sort()
    .join('\n');

  return result;
}
