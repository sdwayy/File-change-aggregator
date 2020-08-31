import _ from 'lodash';

function createNode(key, type, value, optionalParameters) {
  return {
    key,
    type,
    value,
    ...optionalParameters,
  };
}

export default function createTree(firstData, secondData) {
  const keysInFirstData = Object.keys(firstData);
  const keysInSecondData = Object.keys(secondData);
  const uniqKeys = _.union(keysInFirstData, keysInSecondData);

  return uniqKeys.map((key) => {
    const firstValue = firstData[key];
    const secondValue = secondData[key];

    if (_.has(firstData, key) && !_.has(secondData, key)) {
      return createNode(key, 'removed', firstValue);
    }

    if (!_.has(firstData, key) && _.has(secondData, key)) {
      return createNode(key, 'added', secondValue);
    }

    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      return createNode(key, 'nested', null, { children: createTree(firstValue, secondValue) });
    }

    if (firstValue !== secondValue) {
      return createNode(key, 'updated', { oldValue: firstValue, newValue: secondValue });
    }

    return createNode(key, 'unmodifined', firstValue);
  });
}
