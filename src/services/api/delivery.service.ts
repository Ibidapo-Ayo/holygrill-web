import { AxiosError } from 'axios';
import { z } from 'zod';
import { apiClient } from '@/lib/api/client';
import type { DeliveryWindowInfo } from '@/types';
import { OPERATING_HOURS } from '@/services/mocks/platform';
import { getDeliveryWindowInfo } from '@/utils/deliveryWindow';

const gateSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    name: z.string(),
    lat: z.coerce.number(),
    lon: z.coerce.number(),
    base_fee: z.coerce.number(),
    rate_per_km: z.coerce.number(),
    min_fee: z.coerce.number(),
    is_active: z.boolean().optional().default(true),
  })
  .passthrough();

const gatesResponseSchema = z
  .object({
    gates: z.array(gateSchema),
  })
  .passthrough();

const hostelSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    name: z.string(),
    gate_id: z.union([z.string(), z.number()]).transform(String),
    delivery_fee: z.coerce.number(),
    is_active: z.boolean(),
    gates: gateSchema.partial().optional(),
  })
  .passthrough();

const hostelsResponseSchema = z
  .object({
    hostels: z.array(hostelSchema),
  })
  .passthrough();

export interface DeliveryGate {
  id: string;
  name: string;
  lat: number;
  lon: number;
  baseFee: number;
  ratePerKm: number;
  minFee: number;
  isActive: boolean;
}

export interface DeliveryHostel {
  id: string;
  name: string;
  gateId: string;
  deliveryFee: number;
  isActive: boolean;
  gate?: Partial<DeliveryGate>;
}

function unwrapData(payload: unknown): unknown {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: unknown }).data;
  }

  return payload;
}

function toDeliveryGate(gate: z.infer<typeof gateSchema>): DeliveryGate {
  return {
    id: gate.id,
    name: gate.name,
    lat: gate.lat,
    lon: gate.lon,
    baseFee: gate.base_fee,
    ratePerKm: gate.rate_per_km,
    minFee: gate.min_fee,
    isActive: gate.is_active,
  };
}

function toDeliveryHostel(hostel: z.infer<typeof hostelSchema>): DeliveryHostel {
  return {
    id: hostel.id,
    name: hostel.name,
    gateId: hostel.gate_id,
    deliveryFee: hostel.delivery_fee,
    isActive: hostel.is_active,
    gate: hostel.gates
      ? {
          id: hostel.gates.id,
          name: hostel.gates.name,
          lat: hostel.gates.lat,
          lon: hostel.gates.lon,
          baseFee: hostel.gates.base_fee,
          ratePerKm: hostel.gates.rate_per_km,
          minFee: hostel.gates.min_fee,
          isActive: hostel.gates.is_active,
        }
      : undefined,
  };
}

export function getDeliveryErrorMessage(error: unknown, fallback: string): string {
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

export async function getActiveDeliveryGates(): Promise<DeliveryGate[]> {
  const { data } = await apiClient.get<unknown>('/delivery/gates');
  const parsed = gatesResponseSchema.parse(unwrapData(data));

  return parsed.gates.map(toDeliveryGate).filter((gate) => gate.isActive);
}

export async function getActiveOnCampusHostels(): Promise<DeliveryHostel[]> {
  try {
    const { data } = await apiClient.get<unknown>('/delivery/hostels');
    const parsed = hostelsResponseSchema.parse(unwrapData(data));
    return parsed.hostels.map(toDeliveryHostel).filter((hostel) => hostel.isActive);
  } catch (error) {
    if (!(error instanceof AxiosError) || error.response?.status !== 404) {
      throw error;
    }

    const { data } = await apiClient.get<unknown>('/delivery/gates');
    const parsed = hostelsResponseSchema.parse(unwrapData(data));
    return parsed.hostels.map(toDeliveryHostel).filter((hostel) => hostel.isActive);
  }
}

export async function getDeliveryStatus(): Promise<DeliveryWindowInfo> {
  // TODO: Replace mock implementation with backend endpoint.
  // Expected endpoint: GET /api/delivery-window
  return Promise.resolve(getDeliveryWindowInfo(new Date(), OPERATING_HOURS));
}
