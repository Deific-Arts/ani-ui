export interface IQuote {
  id: number;
  documentId: string;
  quote: string;
  likes: number[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  requote: string;
  requotes: number[];
  page: string;
  note: string;
  private: boolean;
  comments: any;
  user: any;
  book: any;
  author: any;
}

export interface IComment {
  id: number;
  quoteId: number;
  documentId: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  user: any;
}

export interface IBook {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  identifier: string;
}

export interface IGoogleBook {
  accessInfo: any;
  etag: string;
  id: string;
  kind: string;
  saleInfo: any;
  selfLink: string;
  volumeInfo: any;
}
