import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DELIVERY_FEE } from '@/data/menu';

type DeliveryLabel = 'Home' | 'Pickup';

type DeliveryInfo = {
  addressId?: string;
  streetAddress: string;
  city: string;
  state: string;
  landmark?: string;
  label: DeliveryLabel;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
};

type PickupInfo = {
  name: string;
  phone: string;
  riderName?: string;
  pickupDate: string;
  pickupWindow: string;
  restaurantAddress: string;
  note?: string;
};

type FulfillmentMethod = 'delivery' | 'pickup';

interface FulfillmentState {
  method: FulfillmentMethod;
  deliveryInfo?: DeliveryInfo;
  pickupInfo?: PickupInfo;
  estimatedDeliveryFee: number;
  setMethod: (method: FulfillmentMethod) => void;
  setEstimatedDeliveryFee: (fee: number) => void;
  setDeliveryCoordinates: (latitude: number, longitude: number) => void;
  saveDelivery: (info: DeliveryInfo) => void;
  savePickup: (info: PickupInfo) => void;
  clearDelivery: () => void;
  clear: () => void;
}

export const useFulfillmentStore = create<FulfillmentState>()(
  persist(
    (set) => ({
      method: 'delivery',
      deliveryInfo: undefined,
      pickupInfo: undefined,
      estimatedDeliveryFee: DELIVERY_FEE,
      setMethod: (method) => set({ method }),
      setEstimatedDeliveryFee: (fee) => set({ estimatedDeliveryFee: Math.max(0, Math.round(fee)) }),
      setDeliveryCoordinates: (latitude, longitude) =>
        set((state) => ({
          method: 'delivery',
          deliveryInfo: {
            addressId: state.deliveryInfo?.addressId,
            streetAddress: state.deliveryInfo?.streetAddress ?? '',
            city: state.deliveryInfo?.city ?? '',
            state: state.deliveryInfo?.state ?? '',
            landmark: state.deliveryInfo?.landmark,
            label: state.deliveryInfo?.label ?? 'Home',
            isDefault: state.deliveryInfo?.isDefault ?? true,
            latitude,
            longitude,
          },
        })),
      saveDelivery: (info) => set({ deliveryInfo: info, method: 'delivery' }),
      savePickup: (info) => set({ pickupInfo: info, method: 'pickup' }),
      clearDelivery: () =>
        set((state) => ({
          method: 'delivery',
          deliveryInfo: undefined,
          estimatedDeliveryFee: DELIVERY_FEE,
          pickupInfo: state.pickupInfo,
        })),
      clear: () => set({ deliveryInfo: undefined, pickupInfo: undefined, method: 'delivery', estimatedDeliveryFee: DELIVERY_FEE }),
    }),
    { name: 'holy-grills-fulfillment' }
  )
);

export const hasDeliveryInfo = (state: FulfillmentState) =>
  Boolean(
    state.deliveryInfo?.streetAddress &&
      state.deliveryInfo?.city &&
      state.deliveryInfo?.state &&
      state.deliveryInfo?.label &&
      Number.isFinite(state.deliveryInfo?.latitude) &&
      Number.isFinite(state.deliveryInfo?.longitude)
  );

export const hasPickupInfo = (state: FulfillmentState) =>
  Boolean(
    state.pickupInfo?.name &&
      state.pickupInfo?.phone &&
      state.pickupInfo?.pickupDate &&
      state.pickupInfo?.pickupWindow &&
      state.pickupInfo?.restaurantAddress
  );
