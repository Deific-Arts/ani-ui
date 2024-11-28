export interface IQuote {
  id: number;
  documentId: string;
  quote: string;
  likes: number[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  requote: number;
  page: string;
  note: string;
  private: boolean;
  comments: any;
  user: any;
  book: any;
  author: any;
}
