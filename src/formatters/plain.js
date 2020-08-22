import _ from 'lodash';

const formatValue = (value) => {
  const isObject = _.isObject(value);
  const isString = typeof value === 'string';

  if (isObject) {
    return '[complex value]';
  }

  if (isString) {
    return `'${value}'`;
  }

  return value;
};

const formatterByType = {
  added: ({ key, value }, prefix) => {
    const formatedValue = formatValue(value);

    return `Property '${prefix}${key}' was added with value: ${formatedValue}`;
  },

  removed: ({ key }, prefix) => `Property '${prefix}${key}' was removed`,

  updated: ({ key, oldValue, newValue }, prefix) => {
    const formatedOldValue = formatValue(oldValue);
    const formatedNewValue = formatValue(newValue);

    return `Property '${prefix}${key}' was updated. From ${formatedOldValue} to ${formatedNewValue}`;
  },
};

export default function plain(tree) {
  const diffs = [];

  const inner = (node, prefix = '') => {
    const { key, type } = node;
    const newPrefix = prefix ? `${prefix}.` : '';

    if (!_.has(formatterByType, type) && type !== '[complex value]') {
      return '';
    }

    if (type === '[complex value]') {
      const { children } = node;

      return children.forEach((child) => inner(child, `${newPrefix}${key}`));
    }

    return diffs.push(formatterByType[type](node, newPrefix));
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
