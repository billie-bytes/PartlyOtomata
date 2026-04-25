import { create } from 'zustand';
import type { Node } from '../types/node';

interface DOMStore {
    // State
    nodes: Node[];
    nodeMap: Map<string, Node>;
    rootId: string | null;
    selectedNodes: string[];
    matchedNodeIds: string[];
    visitedNodeIds: string[];
    rawHtml: string;
    query: string;
    traversalAlgorithm: string | null;
    traversalLength: number;

    // actions
    setNodes: (nodes: Node[], rootId: string) => void;
    setRawHtml: (rawHtml: string) => void;
    setQuery: (query: string) => void;
    setMatchedNodeIds: (ids: string[]) => void;
    setVisitedNodeIds: (ids: string[]) => void;
    setTraversalData: (algorithm: string | null, traversalLength: number) => void;
    getNode: (id: string) => Node | undefined;
    setSelectedNodes: (ids: string[]) => void;
    clearStore: () => void;
}

export const useDOMStore = create<DOMStore>((set, get) => ({
    nodes: [],
    nodeMap: new Map(),
    rootId: null,
    selectedNodes: [],
    matchedNodeIds: [],
    visitedNodeIds: [],
    rawHtml: '',
    query: '',
    traversalAlgorithm: null,
    traversalLength: 0,

    setNodes: (nodes, rootId) => {
        const normalizedNodes = nodes.map(node => ({
            ...node,
            id: String(node.id),
            parent_id: node.parent_id == null ? node.parent_id : String(node.parent_id),
            children: (node.children || []).map(childId => String(childId)),
        }));
        const nodeMap = new Map(normalizedNodes.map(n => [n.id, n]));
        set({
            nodes: normalizedNodes,
            nodeMap,
            rootId: String(rootId),
            selectedNodes: [],
            matchedNodeIds: [],
            visitedNodeIds: [],
            traversalAlgorithm: null,
            traversalLength: 0,
        });
    },

    setRawHtml: (rawHtml) => set({ rawHtml }),
    setQuery: (query) => set({ query }),
    setMatchedNodeIds: (matchedNodeIds) => set({ matchedNodeIds }),
    setVisitedNodeIds: (visitedNodeIds) => set({ visitedNodeIds }),
    setTraversalData: (traversalAlgorithm, traversalLength) =>
        set({ traversalAlgorithm, traversalLength }),

    getNode: (id) => get().nodeMap.get(id),
    setSelectedNodes: (ids) => set({selectedNodes: ids}),

    clearStore: () => set({
        nodes: [],
        nodeMap: new Map(),
        rootId: null,
        selectedNodes: [],
        matchedNodeIds: [],
        visitedNodeIds: [],
        rawHtml: '',
        query: '',
        traversalAlgorithm: null,
        traversalLength: 0,
    }),
}));
