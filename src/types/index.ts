export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  hpValue: number;
  isAvailable: boolean;
  sizes?: string[];
  tagLine?: string;
  slashedPrice?: number;
  percentageOff?: number;
  extras?: {
    title: string;
    price: number;
    imageUrl: string;
  }[];
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

/** A single call-to-action button on the hero carousel */
export interface HeroCTA {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

/** One slide in the hero carousel – stored and managed via the admin panel */
export interface HeroSlide {
  id: string;
  /** Small badge text above the title, e.g. "FUTA's #1 Food Platform" */
  tag: string;
  title: string;
  description: string;
  /** Up to 2 call-to-action buttons */
  ctaButtons: HeroCTA[];
  imageUrl: string;
  isActive: boolean;
}
