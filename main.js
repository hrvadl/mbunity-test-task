import { linkedListToSortedTree } from "./src/helpers.js";
import { INPUT_FILE_PATH, OUTPUT_FILE_PATH } from "./src/constants.js";
import { isFirstChild, isFirstRoot } from "./src/typeCheckers.js";
import { readFile, writeFile } from "./src/file.js";

const convertFlatArrayToSortedTree = (input) => {
  /**
   * mainRoot - the pointer to the first root of the tree(root without previous siblings)
   */
  let mainRoot = null;
  /**
   * Nodes that we've already visited
   * [nodeId]: node
   */
  const visitedNodes = new Map();
  /**
   * Contains all the nodes which are waiting for unvisited sibling to be visited
   * { [previousSiblingId]: node }
   */
  const waitingForSiblingNodes = new Map();
  /**
   * Contains all the nodes which are waiting for unvisited parent to be visited
   * { [parentId]: node }
   */
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
  const handleNotFirstChild = (node) => {
    const previousSibling = visitedNodes.get(node.previousSiblingId);
    if (previousSibling) previousSibling.next = node;
    else waitingForSiblingNodes.set(node.previousSiblingId, node);
  };

  for (let node of input) {
    node = { ...node, children: null, next: null };
    visitedNodes.set(node.nodeId, node);

    if (isFirstChild(node)) handleFirstChild(node);
    else handleNotFirstChild(node);
    /**
     * Setting node's siblings and children(if exist) or else null
     */
    node.next = waitingForSiblingNodes.get(node.nodeId) ?? null;
    node.children = waitingForParentNodes.get(node.nodeId) ?? null;

    if (isFirstRoot(node)) mainRoot = node;
  }
  /**
   * The main root(root with null previous sibling) contains pointer
   * to all other nodes
   */
  return linkedListToSortedTree(mainRoot);
};
/**
 * O(2N) Time complexity
 * 0(3N) Memory complexity :(
 *
 * The idea of that solution is:
 *   1) Convert nodes array to linked list
 *   2) Save node to visited hash map
 *   3) Doesn't node have siblings? (Is node the first child?)
 *     3.1) Yes =>
 *       a) If parent has already been visited set parent.children = node
 *       b) If parent node hasn't been visited save node to waitingParent hash map
 *     3.2) No =>
 *         a) If previousSibling has already been visited set previousSibling.next = node
 *         b) If previous sibling hasn't been visited save node to waitingSibling hash map
 *   4) Does someone wait for this node as for parent?
 *         a) Yes => Get that child from hash map and set node.child = child from hash map
 *         b) No => Set node.child = null
 *   5) Does someone wait for this node as for previous sibling?
 *         a) Yes => Get that sibling from hash map and set node.next = sibling from hash map
 *         b) No => Set node.next = null
 *   6) Is this node main root? (Is node without siblings and parent?)
 *         a) Yes => set mainRoot = node
 *   .....
 *
 *   After looping through all the variables we need to convert linked list
 *   back to required schema
 */
const main = (inputPath, outputPath) => {
  const inputNodes = readFile(inputPath, JSON.parse);
  const sortedTree = convertFlatArrayToSortedTree(inputNodes);
  writeFile(JSON.stringify(sortedTree, null, 2), outputPath);
};

main(INPUT_FILE_PATH, OUTPUT_FILE_PATH);
