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
  const iter = (nodesList, currentPath = []) => nodesList.flatMap((node) => {
    const {
      key, type, value, children,
    } = node;

    const nodePath = currentPath.length > 0
      ? `${currentPath.join('.')}.${key}` : key;

    switch (type) {
      case 'added':
        return `Property '${nodePath}' was added with value: ${formateValue(value)}`;
      case 'removed':
        return `Property '${nodePath}' was removed`;
      case 'updated':
        return `Property '${nodePath}' was updated. From ${formateValue(value.oldValue)} to ${formateValue(value.newValue)}`;
      case 'nested':
        return iter(children, [...currentPath, key]);
      default:
        return [];
    }
  });

  return iter(tree).join('\n');
}
