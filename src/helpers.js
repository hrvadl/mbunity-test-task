/**
 * Basically this is a helper function to convert linked-list-like structure to actual tree
 */
const linkedListToSortedTree = ({ next, ...node }) => {
  const children = node.children ? linkedListToSortedTree(node.children) : []
  const flattenedNode = { ...node, children }

  if (!next) return [flattenedNode]

  const flattenedNextNodes = linkedListToSortedTree(next)
  return [flattenedNode, ...flattenedNextNodes]
}

export default linkedListToSortedTree
