import type { CartItem } from '@/types';

export interface CartResponse {
  items: CartItem[];
  walletBalance: number;
  availableHP: number;
}

export async function getCartSnapshot(items: CartItem[]): Promise<CartResponse> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/cart
  return Promise.resolve({ items, walletBalance: 8400, availableHP: 248 });
}
