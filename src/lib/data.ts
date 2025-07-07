import type { Category, Product, Table } from './types';
import { Coffee, Cookie, Sandwich, GlassWater } from 'lucide-react';

export const categories: Category[] = [
  { id: 1, name: 'Coffee', icon: Coffee },
  { id: 2, name: 'Pastries', icon: Cookie },
  { id: 3, name: 'Sandwiches', icon: Sandwich },
  { id: 4, name: 'Drinks', icon: GlassWater },
];

export const products: Product[] = [
  // Coffee
  { id: 1, name: 'Espresso', price: 2.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'espresso shot' },
  { id: 2, name: 'Latte', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'latte art' },
  { id: 3, name: 'Cappuccino', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cappuccino foam' },
  { id: 4, name: 'Americano', price: 3.0, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'black coffee' },
  { id: 5, name: 'Mocha', price: 4.0, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate coffee' },
  
  // Pastries
  { id: 6, name: 'Croissant', price: 2.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'buttery croissant' },
  { id: 7, name: 'Muffin', price: 2.5, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'blueberry muffin' },
  { id: 8, name: 'Cinnamon Roll', price: 3.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced cinnamon' },
  { id: 9, name: 'Scone', price: 2.75, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cranberry scone' },
  { id: 10, name: 'Pain au Chocolat', price: 2.5, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate pastry' },
  
  // Sandwiches
  { id: 11, name: 'Turkey Club', price: 7.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'turkey sandwich' },
  { id: 12, name: 'Ham & Cheese', price: 6.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'ham cheese' },
  { id: 13, name: 'Veggie Delight', price: 6.0, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegetable sandwich' },
  { id: 14, name: 'Chicken Salad', price: 7.0, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chicken salad' },
  
  // Drinks
  { id: 15, name: 'Orange Juice', price: 3.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'fresh juice' },
  { id: 16, name: 'Iced Tea', price: 2.5, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced tea' },
  { id: 17, name: 'Bottled Water', price: 1.5, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'water bottle' },
  { id: 18, name: 'Sparkling Water', price: 2.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'sparkling water' },
];

export const tables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  status: i % 3 === 0 ? 'occupied' : i % 3 === 1 ? 'reserved' : 'available',
}));
