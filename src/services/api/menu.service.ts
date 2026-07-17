import { AxiosError } from 'axios';
import { z } from 'zod';
import type { MenuItem } from '@/types';
import { apiClient } from '@/lib/api/client';

const menuCategorySchema = z
  .object({
    name: z.string(),
    slug: z.string(),
  })
  .passthrough();

const menuItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.coerce.number(),
    image_url: z.string().nullable().optional(),
    is_available: z.boolean(),
    is_sold_out: z.boolean().optional().default(false),
    is_featured: z.boolean().optional().default(false),
    hp_earn: z.coerce.number().optional().default(0),
    hp_earn_value: z.coerce.number().optional().default(0),
    menu_categories: menuCategorySchema.nullable().optional(),
    tags: z.array(z.string()).optional().default([]),
  })
  .passthrough();

const kitchenSummarySchema = z
  .object({
    daily_order_capacity: z.coerce.number(),
    is_at_capacity: z.boolean(),
    orders_today: z.coerce.number(),
  })
  .passthrough();

const availableMenuItemsResponseSchema = z
  .object({
    items: z.array(menuItemSchema),
    kitchen: kitchenSummarySchema,
  })
  .passthrough();

export interface MenuKitchenSummary {
  dailyOrderCapacity: number;
  isAtCapacity: boolean;
  ordersToday: number;
}

export interface AvailableMenuItemsResponse {
  items: MenuItem[];
  kitchen: MenuKitchenSummary;
}

function toMenuItem(item: z.infer<typeof menuItemSchema>): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    imageUrl: item.image_url ?? '',
    category: item.menu_categories?.name ?? 'Uncategorized',
    hpValue: item.hp_earn_value || item.hp_earn,
    isAvailable: item.is_available && !item.is_sold_out,
    tagLine: item.is_featured ? 'Featured item' : undefined,
  };
}

export function getMenuErrorMessage(error: unknown, fallback: string): string {
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

export async function getAvailableMenuItemsResponse(): Promise<AvailableMenuItemsResponse> {
  const { data } = await apiClient.get<unknown>('/menu/items', {
    params: { available_only: true },
  });
  const parsed = availableMenuItemsResponseSchema.parse(data);

  return {
    items: parsed.items.map(toMenuItem),
    kitchen: {
      dailyOrderCapacity: parsed.kitchen.daily_order_capacity,
      isAtCapacity: parsed.kitchen.is_at_capacity,
      ordersToday: parsed.kitchen.orders_today,
    },
  };
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const response = await getAvailableMenuItemsResponse();
  return response.items;
}

export async function getMenuItemById(menuId: string): Promise<MenuItem | null> {
  const items = await getMenuItems();
  return items.find((item) => item.id === menuId) ?? null;
}
