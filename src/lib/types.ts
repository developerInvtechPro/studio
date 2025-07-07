
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
  icon: React.ComponentType<{ className?: string }>;
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
  id: string;
  username: string;
  password?: string; // Added for mock validation, should not be sent to client in a real app
}

export interface Shift {
  isActive: boolean;
  startingCash: number;
  startTime: string | null;
}
