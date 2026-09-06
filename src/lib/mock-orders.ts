import { Order } from '@/types/order';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1',
    code: 'PCV-240801-001',
    status: 'PENDING',
    createdAt: '2026-08-25T10:00:00.000Z',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Hạt Royal Canin Poodle Adult 1.5kg',
        productImage:
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop',
        price: 350000,
        quantity: 2,
      },
    ],
    totalAmount: 700000,
    shippingFee: 0,
    finalAmount: 700000,
  },
  {
    id: 'ord-2',
    code: 'PCV-240802-045',
    status: 'SHIPPING',
    createdAt: '2026-08-24T14:30:00.000Z',
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Pate Whiskas Vị Cá Ngừ 85g',
        productImage:
          'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=400&auto=format&fit=crop',
        price: 15000,
        quantity: 10,
      },
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Đồ chơi cần câu mèo',
        productImage:
          'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=400&auto=format&fit=crop',
        price: 45000,
        quantity: 1,
      },
    ],
    totalAmount: 195000,
    shippingFee: 30000,
    finalAmount: 225000,
  },

  {
    id: 'ord-4',
    code: 'PCV-240715-089',
    status: 'CANCELLED',
    createdAt: '2026-07-15T20:45:00.000Z',
    items: [
      {
        id: 'item-5',
        productId: 'prod-5',
        productName: 'Nhà cây cho mèo (Cat Tree) cao cấp',
        productImage:
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop',
        price: 850000,
        quantity: 1,
      },
    ],
    totalAmount: 850000,
    shippingFee: 0,
    finalAmount: 850000,
  },
];
