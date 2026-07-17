import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  clearCart,
  createCartItem,
  deleteCartItem,
  getCart,
  type CartSnapshot,
  getCartErrorMessage,
  type CreateCartItemPayload,
  updateCartItem,
  type UpdateCartItemPayload,
} from '@/services/api/cart.service';
import { useAuthStore } from '@/stores/authStore';
import { EMPTY_CART_SNAPSHOT, useCartStore } from '@/stores/cartStore';
import { createCartLineId } from '@/utils/pricing';
import type { CartItem } from '@/types';

export const CART_QUERY_KEY = ['cart'];

interface UpdateCartItemMutationVariables {
  itemId: string;
  payload: UpdateCartItemPayload;
}

interface CartMutationContext {
  previousCart: CartSnapshot;
}

function getCurrentCartSnapshot(): CartSnapshot {
  const { hasUnavailableItems, hpEarnPreview, itemCount, items, subtotal } = useCartStore.getState();

  return {
    hasUnavailableItems,
    hpEarnPreview,
    itemCount,
    items,
    subtotal,
  };
}

function setCartSnapshot(snapshot: CartSnapshot) {
  useCartStore.getState().setCart(snapshot);
}

function hydrateSnapshot(items: CartItem[], partial?: Partial<CartSnapshot>): CartSnapshot {
  return {
    hasUnavailableItems: partial?.hasUnavailableItems ?? false,
    hpEarnPreview: partial?.hpEarnPreview ?? items.reduce((sum, item) => sum + item.hpValue * item.quantity, 0),
    itemCount: partial?.itemCount ?? items.reduce((sum, item) => sum + item.quantity, 0),
    items,
    subtotal: partial?.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

function buildOptimisticCartItem(payload: CreateCartItemPayload): CartItem {
  const notes = payload.notes?.trim() || undefined;

  return {
    id: createCartLineId(payload.menu_item_id, null, [], notes),
    menuItemId: payload.menu_item_id,
    name: 'Cart item',
    price: 0,
    quantity: payload.quantity,
    imageUrl: '',
    hpValue: 0,
    notes,
  };
}

function applyOptimisticAdd(snapshot: CartSnapshot, payload: CreateCartItemPayload): CartSnapshot {
  const optimisticItem = buildOptimisticCartItem(payload);
  const existingItem = snapshot.items.find((item) => item.id === optimisticItem.id);

  if (!existingItem) {
    return hydrateSnapshot([...snapshot.items, optimisticItem], snapshot);
  }

  return hydrateSnapshot(
    snapshot.items.map((item) =>
      item.id === optimisticItem.id
        ? {
            ...item,
            notes: optimisticItem.notes,
            quantity: item.quantity + payload.quantity,
          }
        : item,
    ),
    snapshot,
  );
}

function applyOptimisticUpdate(snapshot: CartSnapshot, itemId: string, payload: UpdateCartItemPayload): CartSnapshot {
  if (payload.quantity !== undefined && payload.quantity <= 0) {
    return applyOptimisticRemove(snapshot, itemId);
  }

  return hydrateSnapshot(
    snapshot.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            notes: payload.notes !== undefined ? payload.notes.trim() || undefined : item.notes,
            quantity: payload.quantity ?? item.quantity,
          }
        : item,
    ),
    snapshot,
  );
}

function applyOptimisticRemove(snapshot: CartSnapshot, itemId: string): CartSnapshot {
  return hydrateSnapshot(snapshot.items.filter((item) => item.id !== itemId), snapshot);
}

function syncQuerySnapshot(queryClient: ReturnType<typeof useQueryClient>, snapshot: CartSnapshot) {
  queryClient.setQueryData(CART_QUERY_KEY, snapshot);
  setCartSnapshot(snapshot);
}

export function useCartQuery() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    enabled: hasHydrated,
    staleTime: 30_000,
    retry: 1,
  });

  useEffect(() => {
    if (query.data) {
      setCartSnapshot(query.data);
    }
  }, [query.data]);

  return query;
}

export function useAddCartItem() {
  const queryClient = useQueryClient();

  return useMutation<CartSnapshot, Error, CreateCartItemPayload, CartMutationContext>({
    mutationFn: (payload) => createCartItem(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartSnapshot>(CART_QUERY_KEY) ?? getCurrentCartSnapshot();
      const optimisticCart = applyOptimisticAdd(previousCart, payload);

      syncQuerySnapshot(queryClient, optimisticCart);

      return { previousCart };
    },
    onError: (error, _payload, context) => {
      if (context?.previousCart) {
        syncQuerySnapshot(queryClient, context.previousCart);
      }
    },
    onSuccess: (snapshot) => {
      syncQuerySnapshot(queryClient, snapshot);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation<CartSnapshot, Error, UpdateCartItemMutationVariables, CartMutationContext>({
    mutationFn: ({ itemId, payload }) =>
      payload.quantity !== undefined && payload.quantity <= 0
        ? deleteCartItem(itemId)
        : updateCartItem(itemId, payload),
    onMutate: async ({ itemId, payload }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartSnapshot>(CART_QUERY_KEY) ?? getCurrentCartSnapshot();
      const optimisticCart = applyOptimisticUpdate(previousCart, itemId, payload);

      syncQuerySnapshot(queryClient, optimisticCart);

      return { previousCart };
    },
    onError: (error, _payload, context) => {
      if (context?.previousCart) {
        syncQuerySnapshot(queryClient, context.previousCart);
      }
    },
    onSuccess: (snapshot) => {
      syncQuerySnapshot(queryClient, snapshot);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation<CartSnapshot, Error, string, CartMutationContext>({
    mutationFn: (itemId) => deleteCartItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartSnapshot>(CART_QUERY_KEY) ?? getCurrentCartSnapshot();
      const optimisticCart = applyOptimisticRemove(previousCart, itemId);

      syncQuerySnapshot(queryClient, optimisticCart);

      return { previousCart };
    },
    onError: (error, _itemId, context) => {
      if (context?.previousCart) {
        syncQuerySnapshot(queryClient, context.previousCart);
      }
    },
    onSuccess: (snapshot) => {
      syncQuerySnapshot(queryClient, snapshot);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation<CartSnapshot, Error, void, CartMutationContext>({
    mutationFn: () => clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<CartSnapshot>(CART_QUERY_KEY) ?? getCurrentCartSnapshot();

      syncQuerySnapshot(queryClient, EMPTY_CART_SNAPSHOT);

      return { previousCart };
    },
    onError: (error, _payload, context) => {
      if (context?.previousCart) {
        syncQuerySnapshot(queryClient, context.previousCart);
      }
    },
    onSuccess: (snapshot) => {
      syncQuerySnapshot(queryClient, snapshot);
    },
  });
}