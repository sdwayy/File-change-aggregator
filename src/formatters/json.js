const indent = 2;

export default function formateToJson(tree) {
  return JSON.stringify(tree, null, indent);
}
