import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartStore } from '@/types/cart';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        if (quantity <= 0) return;

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            productId: product.id,
            name: product.name,
            slug: product.slug,
            imageUrl: product.imageUrl,
            price: product.price,
            originalPrice: product.originalPrice,
            quantity,
            brandName: product.brandName,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(quantity, 99) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'vetimate_cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
