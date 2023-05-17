const { readFile, writeFile } = require("./helpers");
const { INPUT_DESTINATION, OUTPUT_DESTINATION } = require("./constants");

const toTreeStructure = (node) => ({ ...node, children: null, next: null });

const flatNext = ({ next, ...node }) => {
  const children = node.children ? flatNext(node.children) : [];
  const flattenedNode = { ...node, children };
  if (!next) return [flattenedNode];

  const flattenedNextNodes = flatNext(next);

  return [flattenedNode, ...flattenedNextNodes];
};

const convertFlatArrayToSortedTree = (input) => {
  let mainRoot = null;
  const nodes = input.map(toTreeStructure);
  const visitedNodes = new Map();
  const waitingForSiblingNodes = new Map();
  const waitingForParentNodes = new Map();

  for (const node of nodes) {
    visitedNodes.set(node.nodeId, node);

    if (node.previousSiblingId) {
      const previousSibling = visitedNodes.get(node.previousSiblingId);
      if (previousSibling) previousSibling.next = node;
      else waitingForSiblingNodes.set(node.previousSiblingId, node);
    }

    const maybeNextSibling = waitingForSiblingNodes.get(node.nodeId);
    if (maybeNextSibling) node.next = maybeNextSibling;

    const maybeChildren = waitingForParentNodes.get(node.nodeId);
    if (maybeChildren) node.children = maybeChildren;

    if (!node.parentId) {
      if (!node.previousSiblingId) {
        mainRoot = node;
        continue;
      }

      const previousSibling = visitedNodes.get(node.previousSiblingId);
      if (previousSibling) previousSibling.next = node;
      else waitingForSiblingNodes.set(node.previousSiblingId, node);
    } else if (node.parentId && !node.previousSiblingId) {
      const parent = visitedNodes.get(node.parentId);
      if (!parent) waitingForParentNodes.set(node.parentId, node);
      else parent.children = node;
    }
  }

  return flatNext(mainRoot);
};

const main = () => {
  const inputNodesJSON = readFile(INPUT_DESTINATION);
  const inputNodes = JSON.parse(inputNodesJSON);

  const sortedTree = convertFlatArrayToSortedTree(inputNodes);
  writeFile(JSON.stringify(sortedTree), OUTPUT_DESTINATION);
};

main();
