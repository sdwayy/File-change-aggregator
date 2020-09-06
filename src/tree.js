import _ from 'lodash';

const createNode = (key, type, value, optionalParameters) => ({
  key,
  type,
  value,
  ...optionalParameters,
});

export default function createTree(firstData, secondData) {
  const keysInFirstData = Object.keys(firstData);
  const keysInSecondData = Object.keys(secondData);
  const uniqKeys = _.union(keysInFirstData, keysInSecondData);

  const tree = uniqKeys.map((key) => {
    if (!_.has(secondData, key)) {
      return createNode(key, 'removed', firstData[key]);
    }

    if (!_.has(firstData, key)) {
      return createNode(key, 'added', secondData[key]);
    }

    const firstValue = firstData[key];
    const secondValue = secondData[key];

    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      return createNode(key, 'nested', null, { children: createTree(firstValue, secondValue) });
    }

    if (firstValue !== secondValue) {
      return createNode(key, 'updated', { oldValue: firstValue, newValue: secondValue });
    }

    return createNode(key, 'unmodifined', firstValue);
  });

  return tree.sort((a, b) => {
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
}
