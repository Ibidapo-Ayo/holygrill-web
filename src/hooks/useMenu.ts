import { useQuery } from '@tanstack/react-query';
import { getMenuItems } from '@/services/api/menu.service';
import type { MenuItem } from '@/types';

export const MENU_ITEMS_QUERY_KEY = ['menu-items'];

export function useMenuItemsQuery(initialData?: MenuItem[]) {
  return useQuery<MenuItem[], Error>({
    queryKey: MENU_ITEMS_QUERY_KEY,
    queryFn: getMenuItems,
    initialData,
    staleTime: 60_000,
    retry: 1,
  });
}