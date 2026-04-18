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

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';

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
  cancelReason?: string;
  refundedAt?: string;
}

export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  orderId: string;
  paystackRef: string;
  amount: number;
  status: PaymentStatus;
  channel: 'card' | 'bank_transfer' | 'ussd';
  customerEmail: string;
  customerPhone: string;
  paidAt: string;
  refundedAt?: string;
  metadata?: Record<string, unknown>;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'admin';
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
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
