import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  quantity: number;
  stockQuantity: number;
}

interface CartState {
  items: CartItem[];
  selectedItemIds: string[];
  
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleSelection: (id: string) => void;
  selectAll: (isSelected: boolean) => void;
  clearSelection: () => void;
  removeSelectedItems: () => void;
  
  getTotalItems: () => number;
  getTotalUniqueItems: () => number;
  getSelectedTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItemIds: [],

      addItem: (newItem, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === newItem.id
          );

          if (existingItemIndex >= 0) {
            // Đã có trong giỏ -> tăng số lượng (tối đa bằng stockQuantity)
            const updatedItems = [...state.items];
            const item = updatedItems[existingItemIndex];
            const newQuantity = Math.min(
              item.quantity + quantity,
              item.stockQuantity
            );
            updatedItems[existingItemIndex] = { ...item, quantity: newQuantity };
            return { items: updatedItems };
          }

          // Chưa có -> thêm mới
          const addedQuantity = Math.min(quantity, newItem.stockQuantity);
          return {
            items: [...state.items, { ...newItem, quantity: addedQuantity }],
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          selectedItemIds: state.selectedItemIds.filter((selectedId) => selectedId !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stockQuantity)) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], selectedItemIds: [] });
      },

      toggleSelection: (id) => {
        set((state) => ({
          selectedItemIds: state.selectedItemIds.includes(id)
            ? state.selectedItemIds.filter((selectedId) => selectedId !== id)
            : [...state.selectedItemIds, id],
        }));
      },

      selectAll: (isSelected) => {
        set((state) => ({
          selectedItemIds: isSelected ? state.items.map((item) => item.id) : [],
        }));
      },

      clearSelection: () => {
        set({ selectedItemIds: [] });
      },

      removeSelectedItems: () => {
        set((state) => ({
          items: state.items.filter((item) => !state.selectedItemIds.includes(item.id)),
          selectedItemIds: [],
        }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalUniqueItems: () => {
        return get().items.length;
      },

      getSelectedTotalPrice: () => {
        const state = get();
        return state.items
          .filter((item) => state.selectedItemIds.includes(item.id))
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'vetimate-cart-storage',
    }
  )
);
