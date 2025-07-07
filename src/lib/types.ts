
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
  id: number;
  product: Product;
  quantity: number;
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
