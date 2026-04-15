import { create } from 'zustand';

export type PageName = 'home' | 'html-parsing' | 'dfs-traversal' | 'lca-algorithm';

interface NavigationStore {
  currentPage: PageName;
  setPage: (page: PageName) => void;
  goHome: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentPage: 'home',
  setPage: (page: PageName) => set({ currentPage: page }),
  goHome: () => set({ currentPage: 'home' }),
}));
