import { create } from 'zustand';
import type { Node } from '../types/node';

interface DOMStore {
    // State
    nodes: Node[];
    nodeMap: Map<string, Node>;
    rootId: string | null;
    selectedNodes: string[];
    matchedNodeIds: string[];
    rawHtml: string;
    query: string;

    // actions
    setNodes: (nodes: Node[], rootId: string) => void;
    setRawHtml: (rawHtml: string) => void;
    setQuery: (query: string) => void;
    setMatchedNodeIds: (ids: string[]) => void;
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
    rawHtml: '',
    query: '',

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
        });
    },

    setRawHtml: (rawHtml) => set({ rawHtml }),
    setQuery: (query) => set({ query }),
    setMatchedNodeIds: (matchedNodeIds) => set({ matchedNodeIds }),

    getNode: (id) => get().nodeMap.get(id),
    setSelectedNodes: (ids) => set({selectedNodes: ids}),

    clearStore: () => set({
        nodes: [],
        nodeMap: new Map(),
        rootId: null,
        selectedNodes: [],
        matchedNodeIds: [],
        rawHtml: '',
        query: '',
    }),
}));
