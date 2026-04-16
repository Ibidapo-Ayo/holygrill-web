export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  hpValue: number;
  isAvailable: boolean;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface DeliveryAddress {
  streetAddress: string;
  city: string;
  landmark?: string;
  phone: string;
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: DeliveryAddress;
  paystackRef: string;
  hpEarned: number;
  estimatedDelivery: string;
  statusHistory: StatusEvent[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  totalHP: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  hpValue: number;
}
