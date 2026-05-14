import type { DeliveryWindowInfo } from '@/types';
import { OPERATING_HOURS } from '@/services/mocks/platform';
import { getDeliveryWindowInfo } from '@/utils/deliveryWindow';

export async function getDeliveryStatus(): Promise<DeliveryWindowInfo> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/delivery-window
  return Promise.resolve(getDeliveryWindowInfo(new Date(), OPERATING_HOURS));
}
