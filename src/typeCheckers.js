export const isRoot = (node) => !node.parentId;
export const isFirstChild = (node) => !node.previousSiblingId;
export const isFirstRoot = (node) => isRoot(node) && isFirstChild(node);
