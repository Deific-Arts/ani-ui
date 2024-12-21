import { createStore } from 'zustand/vanilla';

export interface IQuoteStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const store = createStore<IQuoteStore>(set => ({
  searchQuery: '',
  setSearchQuery: (query: string) => set(() => { return { searchQuery: query } }),
}));

export default store;
