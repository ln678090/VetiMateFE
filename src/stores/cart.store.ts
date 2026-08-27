import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { ProductCardCompat } from '@/types/shop';

export interface CartItem {
  product: ProductCardCompat;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  selectedIds: string[]; // List of product IDs selected for checkout
  
  // Actions
  addItem: (product: ProductCardCompat, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleSelect: (productId: string) => void;
  selectAll: (selected: boolean) => void;
  clearSelected: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedIds: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          // Tự động chọn item vừa được thêm nếu nó chưa được chọn
          const newSelectedIds = state.selectedIds.includes(product.id) 
            ? state.selectedIds 
            : [...state.selectedIds, product.id];

          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            const updatedItems = [...state.items];
            const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
            updatedItems[existingItemIndex].quantity = Math.min(newQuantity, product.stockQuantity);
            return { items: updatedItems, selectedIds: newSelectedIds };
          }

          // Add new item
          return {
            items: [...state.items, { product, quantity: Math.min(quantity, product.stockQuantity) }],
            selectedIds: newSelectedIds
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
          selectedIds: state.selectedIds.filter(id => id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.min(Math.max(1, quantity), item.product.stockQuantity) } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], selectedIds: [] });
      },

      toggleSelect: (productId) => {
        set((state) => ({
          selectedIds: state.selectedIds.includes(productId)
            ? state.selectedIds.filter(id => id !== productId)
            : [...state.selectedIds, productId]
        }));
      },

      selectAll: (selected) => {
        set((state) => ({
          selectedIds: selected ? state.items.map(item => item.product.id) : []
        }));
      },

      clearSelected: () => {
        set({ selectedIds: [] });
      },
    }),
    {
      name: 'petcare-cart-storage', // name of the item in the storage (must be unique)
    }
  )
);
