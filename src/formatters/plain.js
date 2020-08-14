import _ from 'lodash';

export default function plain(tree, parent = '') {
  let result = '';

  const sorteredTree = tree.sort((a, b) => {
    const firstKey = a.key;
    const secondKey = b.key;

    if (firstKey > secondKey) {
      return 1;
    }

    if (firstKey < secondKey) {
      return -1;
    }

    return 0;
  });

  sorteredTree.forEach((node) => {
    let prefix = '';

    if (parent) {
      prefix = `${parent}.`;
    }

    const { key, type, children } = node;
    let { value, oldValue, newValue } = node;

    const templateString = `\nProperty '${prefix}${key}' was ${type}`;
    const complexValue = '[complex value]';

    const oldValueIsObject = _.isObject(oldValue);
    const newValueIsObject = _.isObject(newValue);
    const valueIsObject = _.isObject(value);

    if (!valueIsObject && typeof value !== 'boolean') {
      value = `'${value}'`;
    }

    if (!oldValueIsObject && typeof oldValue !== 'boolean') {
      oldValue = `'${oldValue}'`;
    }

    if (!newValueIsObject && typeof newValue !== 'boolean') {
      newValue = `'${newValue}'`;
    }

    if (oldValueIsObject) {
      oldValue = complexValue;
    }

    if (newValueIsObject) {
      newValue = complexValue;
    }

    if (valueIsObject) {
      value = complexValue;
    }

    switch (type) {
      case 'added':
        result += `${templateString} with value: ${value}`;
        break;
      case 'removed':
        result += templateString;
        break;
      case 'updated':
        result += `${templateString}. From ${oldValue} to ${newValue}`;
        break;
      case 'nested':
        result += plain(children, `${prefix}${key}`);
        break;
      default:
        return '';
    }

    return '';
  });

  return result;
}
