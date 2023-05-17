const isRoot = (node) => !node.parentId;
const isFirstChild = (node) => !node.previousSiblingId;
const isFirstRoot = (node) => isRoot(node) && !isFirstChild(node);

module.exports = {
  isRoot,
  isFirstChild,
  isFirstRoot,
};
