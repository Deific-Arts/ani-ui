import { createStore } from 'zustand/vanilla';
import { IComment, IQuote } from '../shared/interfaces';

export interface IQuoteStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  quotes: IQuote[],
  addQuote: (quote: IQuote) => void,
  addQuotes: (quotes: IQuote[]) => void,
  addInitialQuotes: (quotes: IQuote[]) => void,
  comments: IComment[],
  addComment: (comment: IComment) => void,
  addInitialComments: (comments: IComment[]) => void,
}

const store = createStore<IQuoteStore>(set => ({
  quotes: [],
  addQuote: (quote: IQuote) => set(state => { return { quotes: [quote, ...state.quotes] } }),
  addQuotes: (quotes: IQuote[]) => set(state => { return { quotes: [...state.quotes, ...quotes] } }),
  addInitialQuotes: (quotes: IQuote[]) => set(() => { return { quotes } }),
  searchQuery: '',
  setSearchQuery: (query: string) => set(() => { return { searchQuery: query } }),
  comments: [],
  addComment: (comment: IComment) => set(state => { return { comments: [...state.comments, comment] } }),
  addInitialComments: (comments: IComment[]) => set(() => { return { comments } }),
}));

export default store;
