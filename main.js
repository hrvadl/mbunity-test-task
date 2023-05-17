const { linkedListToSortedTree, toLinkedStructure } = require("./src/helpers");
const { INPUT_FILE_PATH, OUTPUT_FILE_PATH } = require("./src/constants");
const { isFirstChild, isFirstRoot } = require("./src/typeCheckers");
const { readFile, writeFile } = require("./src/file");
/**
 * mainRoot - the pointer to the first root of the tree(root without previous siblings)
 * nodes - just input nodes converted to the linked list format
 * visitedNodes - nodes that we've already visited
 * waitingForSiblingNodes - nodes that have previous sibling which is not currently visited
 * waitingForParentNodes - nodes that have parent which is not currently visited
 */
const convertFlatArrayToSortedTree = (input) => {
  let mainRoot = null;
  const nodes = input.map(toLinkedStructure);
  const visitedNodes = new Map();
  // check if can be unified
  const waitingForSiblingNodes = new Map();
  const waitingForParentNodes = new Map();
  /**
   * Helper function which is responsible for processing the case when
   * we're dealing with the fist child without siblings
   */
  const handleFirstChild = (node) => {
    const parent = visitedNodes.get(node.parentId);
    if (!parent) waitingForParentNodes.set(node.parentId, node);
    else parent.children = node;
  };
  /**
   * Helper function which is responsible for processing the case when
   * we're dealing with the child with previous siblings
   */
  const handleNestedChild = (node) => {
    const previousSibling = visitedNodes.get(node.previousSiblingId);
    if (previousSibling) previousSibling.next = node;
    else waitingForSiblingNodes.set(node.previousSiblingId, node);
  };

  for (const node of nodes) {
    visitedNodes.set(node.nodeId, node); // mark node as visited

    if (isFirstChild(node)) handleFirstChild(node);
    else handleNestedChild(node);
    /**
     * Setting node's siblings and children(if exist) or else null
     */
    node.next = waitingForSiblingNodes.get(node.nodeId) ?? null;
    node.children = waitingForParentNodes.get(node.nodeId) ?? null;

    if (isFirstRoot(node)) mainRoot = node;
  }

  return linkedListToSortedTree(mainRoot);
};
/**
 * O(2N) time complexity
 */
const main = (inputPath, outputPath) => {
  const inputNodes = readFile(inputPath, JSON.parse);
  const sortedTree = convertFlatArrayToSortedTree(inputNodes);
  writeFile(JSON.stringify(sortedTree), outputPath);
};

main(INPUT_FILE_PATH, OUTPUT_FILE_PATH);
