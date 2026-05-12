import type { MenuItem } from '@/types';
import { MOCK_MENU } from '@/data/menu';

export async function getMenuItems(): Promise<MenuItem[]> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/menu
  return Promise.resolve(MOCK_MENU);
}

export async function getMenuItemById(menuId: string): Promise<MenuItem | null> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/menu/:id
  return Promise.resolve(MOCK_MENU.find((item) => item.id === menuId) ?? null);
}
