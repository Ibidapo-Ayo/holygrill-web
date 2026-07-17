import { create } from 'zustand';
import type { CartItem } from '@/types';
import type { CartSnapshot } from '@/services/api/cart.service';

interface CartState extends CartSnapshot {
  resetCart: () => void;
  setCart: (snapshot: CartSnapshot) => void;
}

export const EMPTY_CART_SNAPSHOT: CartSnapshot = {
  hasUnavailableItems: false,
  hpEarnPreview: 0,
  itemCount: 0,
  items: [],
  subtotal: 0,
};

export const useCartStore = create<CartState>()((set) => ({
  ...EMPTY_CART_SNAPSHOT,
  setCart: (snapshot) => set({
    hasUnavailableItems: snapshot.hasUnavailableItems,
    hpEarnPreview: snapshot.hpEarnPreview,
    itemCount: snapshot.itemCount,
    items: snapshot.items,
    subtotal: snapshot.subtotal,
  }),
  resetCart: () => set(EMPTY_CART_SNAPSHOT),
}));

export const selectItemCount = (state: CartState) => state.itemCount;
export const selectSubtotal = (state: CartState) => state.subtotal;
export const selectTotalHP = (state: CartState) => state.hpEarnPreview;
