import type { Node } from '../types/node';

// Convert flat nodes array ke Map untuk lookup cepat
export function buildNodeMap(nodes: Node[]): Map<string, Node> {
  return new Map(nodes.map(n => [n.id, n]));
}

// Get children nodes dari parent ID
export function getChildren(nodeId: string, nodeMap: Map<string, Node>): Node[] {
  const node = nodeMap.get(nodeId);
  if (!node?.children) return [];
  return node.children
    .map(id => nodeMap.get(id))
    .filter((n): n is Node => n !== undefined);
}

// Get parent dari node ID (cari yg punya node ini di children)
export function getParent(nodeId: string, nodeMap: Map<string, Node>): Node | undefined {
  for (const node of nodeMap.values()) {
    if (node.children?.includes(nodeId)) {
      return node;
    }
  }
  return undefined;
}
