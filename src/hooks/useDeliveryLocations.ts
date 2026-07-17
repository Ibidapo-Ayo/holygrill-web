import { useQuery } from '@tanstack/react-query';
import {
  getActiveDeliveryGates,
  getActiveOnCampusHostels,
  type DeliveryGate,
  type DeliveryHostel,
} from '@/services/api/delivery.service';

export const DELIVERY_GATES_QUERY_KEY = ['delivery', 'gates'];
export const DELIVERY_HOSTELS_QUERY_KEY = ['delivery', 'hostels'];

export function useDeliveryGatesQuery() {
  return useQuery<DeliveryGate[], Error>({
    queryKey: DELIVERY_GATES_QUERY_KEY,
    queryFn: getActiveDeliveryGates,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useDeliveryHostelsQuery() {
  return useQuery<DeliveryHostel[], Error>({
    queryKey: DELIVERY_HOSTELS_QUERY_KEY,
    queryFn: getActiveOnCampusHostels,
    staleTime: 60_000,
    retry: 1,
  });
}
