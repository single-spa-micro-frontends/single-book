export type Book = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
  };
  saleInfo: {
    listPrice: {
      amount: number;
    };
  };
};

export type SelectedBook = {
  id: string;
  title: string;
  author: string;
  price: string;
  description: string;
  publisher: string;
  publicationDate: string;
  language: string;
  pageCount: string | number;
  images: [string, string];
};

export type CartItem = {
  bookId: string;
  title: string;
  image: string | undefined;
  quantity: number;
  [key: string]: any;
};

type EventBus = {
  addToCart: (book: CartItem) => void;
  setSelectedBook: (id: string) => void;
  selectedBookState$: {
    subscribe: (callback: (state: { book: string }) => void) => {
      unsubscribe: () => void;
    };
  };
};

export type EnrichedWindow = Window & { eventBus: EventBus };
