import { useMemo, useState } from 'react';
import { useDOMStore } from '../store/domStore';

interface TreeNodeWithDepth {
  node: any;
  depth: number;
  parentIds: string[];
  isCollapsed: boolean;
}

export function CanvasPanel() {
  const nodes = useDOMStore(state => state.nodes);
  const nodeMap = useDOMStore(state => state.nodeMap);
  const selectedNodes = useDOMStore(state => state.selectedNodes);
  const rootId = useDOMStore(state => state.rootId);
  const setSelectedNodes = useDOMStore(state => state.setSelectedNodes);

  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(100); // Pagination: show 100 at a time

  // Build tree hierarchy with depth information
  const treeStructure = useMemo(() => {
    if (!rootId || nodes.length === 0) return [];

    const result: TreeNodeWithDepth[] = [];
    const visited = new Set<string>();

    function traverse(nodeId: string, depth: number, parentIds: string[]) {
      if (visited.has(nodeId) || depth > 50) return; // Prevent infinite loop
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (!node) return;

      result.push({
        node,
        depth,
        parentIds,
        isCollapsed: collapsedNodes.has(nodeId),
      });

      // Only traverse children if not collapsed
      if (!collapsedNodes.has(nodeId) && node.children && node.children.length > 0) {
        node.children.forEach((childId: string) => {
          traverse(childId, depth + 1, [...parentIds, nodeId]);
        });
      }
    }

    traverse(rootId, 0, []);
    return result;
  }, [rootId, nodeMap, nodes, collapsedNodes]);

  // Get visible nodes (with pagination)
  const visibleNodes = useMemo(() => {
    return treeStructure.slice(0, visibleCount);
  }, [treeStructure, visibleCount]);

  const toggleCollapse = (nodeId: string) => {
    const newCollapsed = new Set(collapsedNodes);
    if (newCollapsed.has(nodeId)) {
      newCollapsed.delete(nodeId);
    } else {
      newCollapsed.add(nodeId);
    }
    setCollapsedNodes(newCollapsed);
  };

  const toggleNodeSelection = (nodeId: string) => {
    if (selectedNodes.includes(nodeId)) {
      setSelectedNodes(selectedNodes.filter(id => id !== nodeId));
    } else {
      setSelectedNodes([...selectedNodes, nodeId]);
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 text-sm">Parse DOM untuk melihat tree</p>
        <p className="text-gray-400 text-xs">Upload HTML file atau paste URL di panel kanan</p>
      </div>
    );
  }

  const hasMoreNodes = visibleCount < treeStructure.length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Info & Controls */}
      <div className="px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <div>
            <span className="font-semibold">Total Nodes:</span> {treeStructure.length}
            {visibleCount < treeStructure.length && (
              <span className="ml-2 text-blue-600">
                (Showing {visibleCount} of {treeStructure.length})
              </span>
            )}
          </div>
          {selectedNodes.length > 0 && (
            <span className="font-semibold text-blue-600">
              Selected: {selectedNodes.length}
            </span>
          )}
        </div>
      </div>

     


    </div>
  );
}