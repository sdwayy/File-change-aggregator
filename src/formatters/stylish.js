import _ from 'lodash';

const typesList = {
  added: '+',
  removed: '-',
  unmodifined: ' ',
};

const baseSpaceIndex = 4;
const spaceIndexForTypes = 2;

function getValue(value, nestingLevel) {
  if (!_.isObject(value)) {
    return value;
  }

  const spaceIndex = nestingLevel * (baseSpaceIndex * 2);

  const getStringObject = (object, spaceForKeys, spaceForCloseBracket) => JSON.stringify(object, null, spaceForKeys).replace(/"/g, '').replace(/}$/, `${spaceForCloseBracket}}`);

  if (nestingLevel === 0) {
    const spaceForCloseBracket = ' '.repeat(spaceIndex + spaceIndexForTypes);

    const result = getStringObject(value, baseSpaceIndex, spaceForCloseBracket);

    return `${result}`;
  }

  const spaceForCloseBracket = ' '.repeat(spaceIndex - spaceIndexForTypes);
  const spaceForKeys = ' '.repeat(spaceIndex + spaceIndexForTypes);

  const result = getStringObject(value, spaceForKeys, spaceForCloseBracket);

  return result;
}

export default function stylish(tree, nestingLevel = 0) {
  let result = '';

  const spaceIndex = nestingLevel * baseSpaceIndex;
  const space = ' '.repeat(spaceIndex);

  const closeBracketSpaceIndex = spaceIndex > 0
    ? spaceIndex - spaceIndexForTypes
    : 0;

  const spaceForCloseBracket = ' '.repeat(closeBracketSpaceIndex);

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

  function inner(node) {
    const { key, type } = node;

    if (type === 'nested') {
      const { children } = node;

      result += `${space}${typesList.unmodifined} ${key}: ${stylish(children, nestingLevel + 1)}\n`;

      return;
    }

    if (type === 'added' || type === 'removed' || type === 'unmodifined') {
      let { value } = node;

      value = getValue(value, nestingLevel);

      result += `${space}${typesList[type]} ${key}: ${value}\n`;
    }

    if (type === 'updated') {
      let { oldValue, newValue } = node;

      newValue = getValue(newValue, nestingLevel);
      oldValue = getValue(oldValue, nestingLevel);

      result += `${space}${typesList.removed} ${key}: ${oldValue}\n${space}${typesList.added} ${key}: ${newValue}\n`;
    }
  }

  sorteredTree.forEach(inner);

  return `{\n${result}${spaceForCloseBracket}}`;
}
// export default function stylish(diff, nestingLevel = 1) {
//   let result = '';

//   const baseGap = 4;
//   const gapLevelForKeys = (nestingLevel - 1) * baseGap;
//   const gap = ' '.repeat(gapLevelForKeys);
//   const gapForResult = nestingLevel > 1 ? ' '.repeat(gapLevelForKeys - 2) : gap;

//   const diffEntries = Object.entries(diff);

//   const sorteredDiff = diffEntries.sort((a, b) => {
//     const regExp = /(\w\S\D)/;

//     const firstKey = a[0];
//     const secondKey = b[0];

//     const indexOfFirstLetterInFirstKey = firstKey.search(regExp);
//     const indexOfFirstLetterInSecondKey = secondKey.search(regExp);

//     const firstString = firstKey.slice(indexOfFirstLetterInFirstKey);
//     const secondString = secondKey.slice(indexOfFirstLetterInSecondKey);

//     if (firstString > secondString) {
//       return 1;
//     }

//     if (firstString < secondString) {
//       return -1;
//     }

//     return 0;
//   });

//   sorteredDiff.forEach((item) => {
//     const key = item[0];
//     const value = item[1];

//     if (_.isObject(value)) {
//       result += `${gap}${key}: ${stylish(value, nestingLevel + 1)}\n`;
//       return;
//     }

//     result += `${gap}${key}: ${value}\n`;
//   });

//   return `{\n${result}${gapForResult}}`;
// }
