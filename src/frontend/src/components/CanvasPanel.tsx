import { useEffect, useMemo, useState } from 'react';
import { useDOMStore } from '../store/domStore';
import type { Node } from '../types/node';

interface LayoutNode {
  id: string;
  node: Node;
  x: number;
  y: number;
  depth: number;
}

interface LayoutEdge {
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const NODE_WIDTH = 96;
const NODE_HEIGHT = 36;
const H_GAP = 44;
const V_GAP = 88;
const PADDING_X = 60;
const PADDING_Y = 40;

export function CanvasPanel() {
  const nodes = useDOMStore(state => state.nodes);
  const nodeMap = useDOMStore(state => state.nodeMap);
  const rootId = useDOMStore(state => state.rootId);
  const query = useDOMStore(state => state.query);
  const selectedNodes = useDOMStore(state => state.selectedNodes);
  const matchedNodeIds = useDOMStore(state => state.matchedNodeIds);
  const visitedNodeIds = useDOMStore(state => state.visitedNodeIds);
  const traversalAlgorithm = useDOMStore(state => state.traversalAlgorithm);
  const traversalLength = useDOMStore(state => state.traversalLength);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const layout = useMemo(() => {
    if (!rootId || nodes.length === 0) {
      return {
        layoutNodes: [] as LayoutNode[],
        layoutEdges: [] as LayoutEdge[],
        traversalOrder: [] as string[],
        width: 800,
        height: 500,
      };
    }

    const layoutNodes: LayoutNode[] = [];
    const layoutEdges: LayoutEdge[] = [];
    const traversalOrder: string[] = [];
    const visited = new Set<string>();
    let leafIndex = 0;
    let maxDepth = 0;

    function placeNode(nodeId: string, depth: number): number {
      if (visited.has(nodeId)) {
        return PADDING_X;
      }
      visited.add(nodeId);
      traversalOrder.push(nodeId);
      maxDepth = Math.max(maxDepth, depth);

      const node = nodeMap.get(nodeId);
      if (!node) {
        return PADDING_X;
      }

      const childXs = node.children
        .map(childId => placeNode(childId, depth + 1))
        .filter(x => Number.isFinite(x));

      let x: number;
      if (childXs.length === 0) {
        x = PADDING_X + leafIndex * (NODE_WIDTH + H_GAP);
        leafIndex++;
      } else {
        x = childXs.reduce((sum, value) => sum + value, 0) / childXs.length;
      }

      const y = PADDING_Y + depth * V_GAP;
      layoutNodes.push({ id: nodeId, node, x, y, depth });

      for (const childId of node.children) {
        const childNode = layoutNodes.find(item => item.id === childId);
        if (!childNode) continue;
        layoutEdges.push({
          from: nodeId,
          to: childId,
          x1: x,
          y1: y + NODE_HEIGHT / 2,
          x2: childNode.x,
          y2: childNode.y - NODE_HEIGHT / 2,
        });
      }

      return x;
    }

    placeNode(rootId, 0);

    return {
      layoutNodes,
      layoutEdges,
      traversalOrder,
      width: Math.max(900, PADDING_X * 2 + Math.max(1, leafIndex) * (NODE_WIDTH + H_GAP)),
      height: Math.max(420, PADDING_Y * 2 + (maxDepth + 1) * V_GAP),
    };
  }, [nodeMap, nodes, rootId]);

  const animationOrder = useMemo(() => {
    if (visitedNodeIds.length > 0) return visitedNodeIds;
    if (selectedNodes.length > 0) return selectedNodes;
    if (matchedNodeIds.length > 0) return matchedNodeIds;
    return layout.traversalOrder;
  }, [layout.traversalOrder, matchedNodeIds, selectedNodes, visitedNodeIds]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
  }, [query, traversalAlgorithm, matchedNodeIds, visitedNodeIds]);

  useEffect(() => {
    if (!isPlaying || animationOrder.length === 0) return;

    if (currentStep >= animationOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStep(step => step + 1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [animationOrder.length, currentStep, isPlaying]);

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 text-sm">Parse DOM untuk melihat tree</p>
        <p className="text-gray-400 text-xs">Upload HTML file atau paste URL di panel kanan</p>
      </div>
    );
  }

  const animatedIds = new Set(
    currentStep >= 0 ? animationOrder.slice(0, currentStep + 1) : []
  );
  const currentAnimatedId =
    currentStep >= 0 && currentStep < animationOrder.length ? animationOrder[currentStep] : null;
  const matchedIdSet = new Set(matchedNodeIds);
  const animatedCount = currentStep >= 0 ? Math.min(currentStep + 1, animationOrder.length) : 0;
  const traversalLabel = traversalAlgorithm ?? 'Belum ada traversal';

  const startAnimation = () => {
    if (animationOrder.length === 0) return;
    setCurrentStep(-1);
    setIsPlaying(true);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 bg-gray-100 border-b border-gray-300">
        <div className="flex justify-between items-center gap-4 text-xs text-gray-600">
          <div className="flex flex-wrap gap-4">
            <span>
              <span className="font-semibold">Traversal:</span> {traversalLabel}
            </span>
            <span>
              <span className="font-semibold">Query:</span> {query || '-'}
            </span>
            <span>
              <span className="font-semibold">Total Nodes:</span> {layout.layoutNodes.length}
            </span>
            <span>
              <span className="font-semibold">Matched:</span> {matchedNodeIds.length}
            </span>
            <span>
              <span className="font-semibold">Visited:</span> {traversalLength || visitedNodeIds.length}
            </span>
            <span>
              <span className="font-semibold">Animated:</span> {animatedCount}/{animationOrder.length}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={startAnimation}
              disabled={animationOrder.length === 0}
              className="px-3 py-1 rounded-md text-white font-semibold"
              style={{ backgroundColor: '#355872' }}
            >
              Play
            </button>
            <button
              type="button"
              onClick={resetAnimation}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 font-semibold"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[#f8fafc]">
        <svg width={layout.width} height={layout.height} className="min-w-full min-h-full">
          {layout.layoutEdges.map(edge => (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="#b6c2cf"
              strokeWidth="2"
            />
          ))}

          {layout.layoutNodes.map(item => {
            const isMatched = matchedIdSet.has(item.id);
            const isVisited = animatedIds.has(item.id);
            const isCurrent = currentAnimatedId === item.id;

            let fill = '#e2e8f0';
            let stroke = '#94a3b8';
            if (isMatched) {
              fill = '#fde68a';
              stroke = '#f59e0b';
            }
            if (isVisited) {
              fill = '#bfdbfe';
              stroke = '#3b82f6';
            }
            if (isCurrent) {
              fill = '#fdba74';
              stroke = '#ea580c';
            }

            return (
              <g key={item.id} transform={`translate(${item.x - NODE_WIDTH / 2}, ${item.y - NODE_HEIGHT / 2})`}>
                <rect
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={10}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={NODE_WIDTH / 2}
                  y={NODE_HEIGHT / 2 + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#1e293b"
                >
                  {item.node.tag}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
