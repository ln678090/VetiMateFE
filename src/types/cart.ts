export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  originalPrice?: number | null;
  quantity: number;
  stock?: number;
  brandName?: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: number;
    originalPrice?: number | null;
    inStock?: boolean;
    brandName?: string;
  }, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}
