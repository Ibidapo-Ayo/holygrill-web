import { z } from 'zod';
import { apiClient } from './client';

export type DeliveryType = 'on_campus' | 'off_campus';

export interface CalculateDeliveryFeePayload {
  delivery_location_id: string;
  delivery_type: DeliveryType;
  lat: number;
  lon: number;
}

const calculateDeliveryFeePayloadSchema = z.object({
  delivery_location_id: z.string().min(1),
  delivery_type: z.enum(['on_campus', 'off_campus']),
  lat: z.coerce.number(),
  lon: z.coerce.number(),
});

function extractFee(data: unknown): number {
  const fallback = z.coerce.number().safeParse(data);

  if (fallback.success) {
    return Math.max(0, Math.round(fallback.data));
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Unable to parse delivery fee response.');
  }

  const shaped = data as Record<string, unknown>;
  const candidates = ['fee', 'delivery_fee', 'amount', 'price', 'total'];

  for (const key of candidates) {
    const parsed = z.coerce.number().safeParse(shaped[key]);
    if (parsed.success) {
      return Math.max(0, Math.round(parsed.data));
    }
  }

  if (shaped.data && typeof shaped.data === 'object') {
    const nested = shaped.data as Record<string, unknown>;

    for (const key of candidates) {
      const parsed = z.coerce.number().safeParse(nested[key]);
      if (parsed.success) {
        return Math.max(0, Math.round(parsed.data));
      }
    }
  }

  throw new Error('Unable to parse delivery fee response.');
}

export async function calculateDeliveryFee(
  payload: CalculateDeliveryFeePayload,
): Promise<number> {
  const validatedPayload = calculateDeliveryFeePayloadSchema.parse(payload);
  const { data } = await apiClient.post<unknown>('/delivery/calculate-fee', validatedPayload);
  return extractFee(data);
}
