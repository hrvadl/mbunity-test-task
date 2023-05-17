/**
 * Basically is a helper function to convert linked-list-like structure to actual tree
 */
const linkedListToSortedTree = ({ next, ...node }) => {
  const children = node.children ? linkedListToSortedTree(node.children) : [];
  const flattenedNode = { ...node, children };
  if (!next) return [flattenedNode];

  const flattenedNextNodes = linkedListToSortedTree(next);

  return [flattenedNode, ...flattenedNextNodes];
};
/**
 * Function to convert flat node to LinkedList item structure
 */
const toLinkedStructure = (node) => ({
  ...node,
  children: null,
  next: null,
});

module.exports = {
  toLinkedStructure,
  linkedListToSortedTree,
};
