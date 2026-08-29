export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: string;
  shippingAddress?: string;
  note?: string;
  customerName?: string;
  customerPhone?: string;
}
