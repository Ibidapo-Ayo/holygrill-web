import type { Order } from '@/types';
import { MOCK_ORDERS } from '@/data/mockOrders';

export async function getOrders(): Promise<Order[]> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/orders
  return Promise.resolve(MOCK_ORDERS);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/orders/:id
  return Promise.resolve(MOCK_ORDERS.find((order) => order.id === orderId) ?? null);
}
