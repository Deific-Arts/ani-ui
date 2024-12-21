import { createStore } from 'zustand/vanilla';
import { IQuote } from '../shared/interfaces';

export interface IQuoteStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  quotes: IQuote[],
  addQuote: (quote: IQuote) => void,
  addInitialQuotes: (quotes: IQuote[]) => void
}

const store = createStore<IQuoteStore>(set => ({
  quotes: [],
  addQuote: (quote: IQuote) => set(state => { return { quotes: [quote, ...state.quotes] } }),
  addInitialQuotes: (quotes: IQuote[]) => set(() => { return { quotes } }),
  searchQuery: '',
  setSearchQuery: (query: string) => set(() => { return { searchQuery: query } }),
}));

export default store;
