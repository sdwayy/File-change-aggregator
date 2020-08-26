import _ from 'lodash';

const baseIndent = 2;
const indentForTypes = 2;

const typeMark = {
  added: '+',
  removed: '-',
  unmodifined: ' ',
};

const sortTree = (tree) => tree.sort((a, b) => {
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

const getSpace = (indent) => {
  if (indent < 1) {
    return '';
  }

  return ' '.repeat(indent);
};

const formateValue = (value, indent) => {
  if (!_.isObject(value)) {
    return value;
  }

  const space = getSpace(indent + baseIndent + indentForTypes * 2);
  const spaceForCloseBracket = getSpace(indent + baseIndent);

  const entries = Object.entries(value);

  const result = entries.map(([key, innerValue]) => {
    if (_.isObject(innerValue)) {
      return `${space}${key}: ${formateValue(innerValue, indent + baseIndent + indentForTypes)}`;
    }

    return `${space}${key}: ${innerValue}`;
  }).join('\n');

  return `{\n${result}\n${spaceForCloseBracket}}`;
};

export default function formateToStylish(astTree) {
  const inner = (tree, indent = baseIndent) => {
    const sorteredTree = sortTree(tree);

    const space = getSpace(indent);
    const spaceForCloseBracket = getSpace(indent - indentForTypes);

    const diffList = sorteredTree.map((node) => {
      const {
        key, value, type, oldValue, newValue, children,
      } = node;

      switch (type) {
        case 'added':
        case 'removed':
        case 'unmodifined':
          return `${space}${typeMark[type]} ${key}: ${formateValue(value, indent)}`;
        case 'updated':
          return `${space}${typeMark.removed} ${key}: ${formateValue(oldValue, indent)}\n${space}${typeMark.added} ${key}: ${formateValue(newValue, indent)}`;
        case 'nested':
          return `${space}${typeMark.unmodifined} ${key}: ${inner(children, indent + baseIndent + indentForTypes)}`;
        default:
          throw new Error('unknown type');
      }
    });

    return `{\n${diffList.join('\n')}\n${spaceForCloseBracket}}`;
  };

  return inner(astTree);
}
