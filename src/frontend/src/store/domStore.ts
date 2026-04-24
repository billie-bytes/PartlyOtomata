import { create } from 'zustand';
import type { Node } from '../types/node';

interface DOMStore {
    // State
    nodes: Node[];
    nodeMap: Map<string, Node>;
    rootId: string | null;
    selectedNodes: string[];
    rawHtml: string;

    // actions
    setNodes: (nodes: Node[], rootId: string) => void;
    setRawHtml: (rawHtml: string) => void;
    getNode: (id: string) => Node | undefined;
    setSelectedNodes: (ids: string[]) => void;
    clearStore: () => void;
}

export const useDOMStore = create<DOMStore>((set, get) => ({
    nodes: [],
    nodeMap: new Map(),
    rootId: null,
    selectedNodes: [],
    rawHtml: '',

    setNodes: (nodes, rootId) => {
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        set({ nodes, nodeMap, rootId });
    },

    setRawHtml: (rawHtml) => set({ rawHtml }),

    getNode: (id) => get().nodeMap.get(id),
    setSelectedNodes: (ids) => set({selectedNodes: ids}),

    clearStore: () => set({
        nodes: [],
        nodeMap: new Map(),
        rootId: null,
        selectedNodes: [],
        rawHtml: '',
    }),
}));
