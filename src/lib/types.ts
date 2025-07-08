
export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl: string;
  imageHint: string;
}

export interface Category {
  id: number;
  name: string;
  iconName: string;
}

export interface OrderItem {
  id: number; // This is the order_items.id
  product: Product;
  quantity: number;
  price_at_time: number;
}

export interface Table {
  id: number;
  name: string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface User {
  id: number;
  username: string;
  password?: string;
}

export interface Shift {
  id: number;
  userId: number;
  startTime: string;
  endTime?: string | null;
  startingCash: number;
  endingCash?: number | null;
  isActive: boolean;
}

export interface Order {
    id: number;
    shift_id: number;
    table_id: number | null;
    customer_name: string;
    subtotal: number;
    tax_amount: number;
    discount_percentage: number;
    discount_amount: number;
    total_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    items: OrderItem[];
    order_type: 'dine-in' | 'take-away' | 'delivery';
}
