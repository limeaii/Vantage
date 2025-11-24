export interface Product {
  title: string;
  price: string;
  storeName: string;
  url: string;
  imageUrl?: string;
  description: string;
  currency?: string;
}

export interface SearchState {
  isLoading: boolean;
  data: {
    summary: string;
    products: Product[];
    generatedImage?: string | null;
  } | null;
  error: string | null;
}

export enum ViewState {
  HOME,
  RESULTS
}

export interface CartItem extends Product {
  id: string;
  addedAt: number;
}

export interface User {
  username: string;
  name: string;
  password?: string; // In a real app, this would be a hash
  cart: CartItem[];
}
