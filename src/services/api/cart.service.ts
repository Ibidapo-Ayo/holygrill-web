import { AxiosError } from 'axios';
import { ZodError, z } from 'zod';
import type { CartItem } from '@/types';
import { apiClient } from '@/lib/api/client';

const cartItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    menu_item_id: z.union([z.string(), z.number()]).transform(String).optional(),
    menuItemId: z.union([z.string(), z.number()]).transform(String).optional(),
    name: z.string().optional(),
    price: z.coerce.number().optional(),
    quantity: z.coerce.number().int().nonnegative(),
    image_url: z.string().optional(),
    imageUrl: z.string().optional(),
    hp_value: z.coerce.number().optional(),
    hpValue: z.coerce.number().optional(),
    size_label: z.string().nullable().optional(),
    sizeLabel: z.string().nullable().optional(),
    extras: z.array(z.string()).optional(),
    notes: z.string().nullable().optional(),
  })
  .passthrough();

const cartSnapshotSchema = z
  .object({
    has_unavailable_items: z.boolean().optional(),
    hasUnavailableItems: z.boolean().optional(),
    hp_earn_preview: z.coerce.number().optional(),
    hpEarnPreview: z.coerce.number().optional(),
    item_count: z.coerce.number().optional(),
    itemCount: z.coerce.number().optional(),
    items: z.array(cartItemSchema),
    subtotal: z.coerce.number().optional(),
  })
  .passthrough();

const createCartItemPayloadSchema = z.object({
  menu_item_id: z.string().min(1, 'Menu item is required.'),
  notes: z.string().max(500, 'Notes must be 500 characters or fewer.').optional().default(''),
  quantity: z.number().int().positive('Quantity must be at least 1.'),
});

const updateCartItemPayloadSchema = z
  .object({
    quantity: z.number().int().min(0).optional(),
    notes: z.string().max(500, 'Notes must be 500 characters or fewer.').optional(),
  })
  .strict()
  .refine((payload) => payload.quantity !== undefined || payload.notes !== undefined, {
    message: 'Provide a quantity or notes update.',
  });

export interface CartSnapshot {
  hasUnavailableItems: boolean;
  hpEarnPreview: number;
  itemCount: number;
  items: CartItem[];
  subtotal: number;
}

export interface CreateCartItemPayload {
  menu_item_id: string;
  notes?: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  notes?: string;
  quantity?: number;
}

function unwrapData(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }

  return payload;
}

function unwrapCartSnapshot(payload: unknown): unknown {
  const unwrapped = unwrapData(payload);

  if (unwrapped && typeof unwrapped === 'object') {
    if ('cart' in unwrapped) {
      return (unwrapped as { cart: unknown }).cart;
    }

    if ('snapshot' in unwrapped) {
      return (unwrapped as { snapshot: unknown }).snapshot;
    }
  }

  return unwrapped;
}

function normalizeCartItem(value: unknown): CartItem {
  const parsed = cartItemSchema.parse(value);

  return {
    id: parsed.id,
    menuItemId: parsed.menu_item_id ?? parsed.menuItemId ?? parsed.id,
    name: parsed.name ?? '',
    price: parsed.price ?? 0,
    quantity: parsed.quantity,
    imageUrl: parsed.image_url ?? parsed.imageUrl ?? '',
    hpValue: parsed.hp_value ?? parsed.hpValue ?? 0,
    sizeLabel: parsed.size_label ?? parsed.sizeLabel ?? undefined,
    extras: parsed.extras,
    notes: parsed.notes ?? undefined,
  };
}

function normalizeCartSnapshot(payload: unknown): CartSnapshot {
  const parsed = cartSnapshotSchema.parse(unwrapCartSnapshot(payload));
  const items = parsed.items.map(normalizeCartItem);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hpEarnPreview = items.reduce((sum, item) => sum + item.hpValue * item.quantity, 0);

  return {
    hasUnavailableItems: parsed.has_unavailable_items ?? parsed.hasUnavailableItems ?? false,
    hpEarnPreview: parsed.hp_earn_preview ?? parsed.hpEarnPreview ?? hpEarnPreview,
    itemCount: parsed.item_count ?? parsed.itemCount ?? itemCount,
    items,
    subtotal: parsed.subtotal ?? subtotal,
  };
}

export function getCartErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your internet and try again.';
    }

    const responseData = error.response?.data as
      | { message?: string; error?: string; detail?: string }
      | undefined;

    if (typeof responseData?.message === 'string' && responseData.message.trim()) {
      return responseData.message;
    }

    if (typeof responseData?.error === 'string' && responseData.error.trim()) {
      return responseData.error;
    }

    if (typeof responseData?.detail === 'string' && responseData.detail.trim()) {
      return responseData.detail;
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export async function getCart(): Promise<CartSnapshot> {
  const { data } = await apiClient.get<unknown>('/cart');
  return normalizeCartSnapshot(data);
}

export async function createCartItem(payload: CreateCartItemPayload): Promise<CartSnapshot> {
  const validatedPayload = createCartItemPayloadSchema.parse(payload);
  const { data } = await apiClient.post<unknown>('/cart', validatedPayload);

  try {
    return normalizeCartSnapshot(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return getCart();
    }

    throw error;
  }
}

export async function updateCartItem(itemId: string, payload: UpdateCartItemPayload): Promise<CartSnapshot> {
  const validatedPayload = updateCartItemPayloadSchema.parse(payload);
  const { data } = await apiClient.patch<unknown>(`/cart/${itemId}`, validatedPayload);

  try {
    return normalizeCartSnapshot(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return getCart();
    }

    throw error;
  }
}

export async function deleteCartItem(itemId: string): Promise<CartSnapshot> {
  const { data } = await apiClient.delete<unknown>(`/cart/${itemId}`);

  try {
    return normalizeCartSnapshot(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return getCart();
    }

    throw error;
  }
}

export async function clearCart(): Promise<CartSnapshot> {
  const { data } = await apiClient.delete<unknown>('/cart');

  try {
    return normalizeCartSnapshot(data);
  } catch (error) {
    if (error instanceof ZodError) {
      return getCart();
    }

    throw error;
  }
}
