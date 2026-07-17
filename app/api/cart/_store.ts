import { cookies } from 'next/headers';
import { z } from 'zod';
import { AUTH_USER_ID_COOKIE_NAME } from '@/lib/auth-session';
import { createCartLineId } from '@/utils/pricing';

export interface ApiCartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  hp_value: number;
  size_label?: string;
  extras?: string[];
  notes?: string;
}

export interface ApiCartSnapshot {
  has_unavailable_items: boolean;
  hp_earn_preview: number;
  item_count: number;
  items: ApiCartItem[];
  subtotal: number;
}

const createCartItemPayloadSchema = z.object({
  menu_item_id: z.string().min(1),
  notes: z.string().max(500).optional().default(''),
  quantity: z.coerce.number().int().positive(),
  image_url: z.string().optional(),
  hp_value: z.coerce.number().optional(),
  name: z.string().optional(),
  price: z.coerce.number().optional(),
  size_label: z.string().optional(),
  extras: z.array(z.string()).optional(),
});

const updateCartItemPayloadSchema = z
  .object({
    quantity: z.coerce.number().int().min(0).optional(),
    notes: z.string().max(500).optional(),
  })
  .strict()
  .refine((payload) => payload.quantity !== undefined || payload.notes !== undefined);

type CartSessions = Record<string, ApiCartSnapshot>;

declare global {
  var __HOLY_GRILLS_CARTS__: CartSessions | undefined;
}

const cartSessions = globalThis.__HOLY_GRILLS_CARTS__ ?? (globalThis.__HOLY_GRILLS_CARTS__ = {});

function cloneCartSnapshot(snapshot: ApiCartSnapshot): ApiCartSnapshot {
  return {
    has_unavailable_items: snapshot.has_unavailable_items,
    hp_earn_preview: snapshot.hp_earn_preview,
    item_count: snapshot.item_count,
    items: snapshot.items.map((item) => ({
      ...item,
      extras: item.extras ? [...item.extras] : undefined,
    })),
    subtotal: snapshot.subtotal,
  };
}

function createEmptyCartSnapshot(): ApiCartSnapshot {
  return {
    has_unavailable_items: false,
    hp_earn_preview: 0,
    item_count: 0,
    items: [],
    subtotal: 0,
  };
}

function hydrateCartSnapshot(items: ApiCartItem[]): ApiCartSnapshot {
  return {
    has_unavailable_items: false,
    hp_earn_preview: items.reduce((sum, item) => sum + item.hp_value * item.quantity, 0),
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    items,
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

async function resolveCartSessionKey(request: Request): Promise<string> {
  const cookieStore = await cookies();
  return (
    cookieStore.get(AUTH_USER_ID_COOKIE_NAME)?.value ||
    request.headers.get('x-cart-session') ||
    'guest'
  );
}

export async function getCartSnapshotForRequest(request: Request): Promise<ApiCartSnapshot> {
  const sessionKey = await resolveCartSessionKey(request);

  if (!cartSessions[sessionKey]) {
    cartSessions[sessionKey] = createEmptyCartSnapshot();
  }

  return cloneCartSnapshot(cartSessions[sessionKey]);
}

async function saveCartSnapshot(request: Request, snapshot: ApiCartSnapshot): Promise<ApiCartSnapshot> {
  const sessionKey = await resolveCartSessionKey(request);
  cartSessions[sessionKey] = cloneCartSnapshot(hydrateCartSnapshot(snapshot.items));
  return cloneCartSnapshot(cartSessions[sessionKey]);
}

export async function addCartItemForRequest(request: Request, payload: unknown): Promise<ApiCartSnapshot> {
  const validatedPayload = createCartItemPayloadSchema.parse(payload);
  const snapshot = await getCartSnapshotForRequest(request);
  const extras = validatedPayload.extras?.filter(Boolean) ?? [];
  const notes = validatedPayload.notes.trim() || undefined;
  const id = createCartLineId(validatedPayload.menu_item_id, validatedPayload.size_label, extras, notes);
  const price = validatedPayload.price ?? 0;

  if (!validatedPayload.name || !validatedPayload.image_url) {
    throw new Error('Item details are incomplete.');
  }

  const existingItem = snapshot.items.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += validatedPayload.quantity;
    existingItem.notes = notes;
  } else {
    snapshot.items.push({
      id,
      menu_item_id: validatedPayload.menu_item_id,
      name: validatedPayload.name,
      price,
      quantity: validatedPayload.quantity,
      image_url: validatedPayload.image_url,
      hp_value: validatedPayload.hp_value ?? 0,
      size_label: validatedPayload.size_label,
      extras,
      notes,
    });
  }

  return saveCartSnapshot(request, snapshot);
}

export async function updateCartItemForRequest(
  request: Request,
  itemId: string,
  payload: unknown,
): Promise<ApiCartSnapshot> {
  const validatedPayload = updateCartItemPayloadSchema.parse(payload);
  const snapshot = await getCartSnapshotForRequest(request);
  const item = snapshot.items.find((entry) => entry.id === itemId);

  if (!item) {
    throw new Error('Cart item not found.');
  }

  if (validatedPayload.quantity !== undefined) {
    item.quantity = validatedPayload.quantity;
  }

  if (validatedPayload.notes !== undefined) {
    item.notes = validatedPayload.notes.trim() || undefined;
  }

  snapshot.items = snapshot.items.filter((entry) => entry.quantity > 0);

  return saveCartSnapshot(request, snapshot);
}

export async function removeCartItemForRequest(request: Request, itemId: string): Promise<ApiCartSnapshot> {
  const snapshot = await getCartSnapshotForRequest(request);
  snapshot.items = snapshot.items.filter((item) => item.id !== itemId);
  return saveCartSnapshot(request, snapshot);
}

export async function clearCartForRequest(request: Request): Promise<ApiCartSnapshot> {
  return saveCartSnapshot(request, createEmptyCartSnapshot());
}