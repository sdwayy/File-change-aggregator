const indent = 2;

export default function toJson(tree) {
  return JSON.stringify(tree, null, indent);
}
