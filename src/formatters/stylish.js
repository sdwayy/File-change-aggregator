import _ from 'lodash';

const baseIndent = 2;
const indentForTypes = 2;

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

  return ['{', result, `${spaceForCloseBracket}}`].join('\n');
};

export default function formateToStylish(astTree) {
  const iter = (tree, indent = baseIndent) => {
    const space = getSpace(indent);
    const spaceForCloseBracket = getSpace(indent - indentForTypes);

    const diff = tree.map((node) => {
      const {
        key, value, type, children,
      } = node;

      switch (type) {
        case 'added':
          return `${space}+ ${key}: ${formateValue(value, indent)}`;
        case 'removed':
          return `${space}- ${key}: ${formateValue(value, indent)}`;
        case 'unmodifined':
          return `${space}  ${key}: ${formateValue(value, indent)}`;
        case 'updated':
          return [
            `${space}- ${key}: ${formateValue(value.oldValue, indent)}`,
            `${space}+ ${key}: ${formateValue(value.newValue, indent)}`,
          ].join('\n');
        case 'nested':
          return `${space}  ${key}: ${iter(children, indent + baseIndent + indentForTypes)}`;
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    }).join('\n');

    return ['{', diff, `${spaceForCloseBracket}}`].join('\n');
  };

  return iter(astTree);
}
