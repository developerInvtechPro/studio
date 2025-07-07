import type { Category, Product, Table } from './types';
import { 
  Coffee, 
  Cookie, 
  Sandwich, 
  GlassWater,
  Salad,
  Soup,
  CakeSlice,
  IceCream2,
  UtensilsCrossed,
  Milk,
  Leaf,
  Star,
  Egg,
  Utensils,
  Wine,
  Vegan
} from 'lucide-react';

export const categories: Category[] = [
  { id: 1, name: 'Coffee', icon: Coffee },
  { id: 2, name: 'Pastries', icon: Cookie },
  { id: 3, name: 'Sandwiches', icon: Sandwich },
  { id: 4, name: 'Drinks', icon: GlassWater },
  { id: 5, name: 'Salads', icon: Salad },
  { id: 6, name: 'Soups', icon: Soup },
  { id: 7, name: 'Desserts', icon: CakeSlice },
  { id: 8, name: 'Frappes', icon: IceCream2 },
  { id: 9, name: 'Sides', icon: UtensilsCrossed },
  { id: 10, name: 'Smoothies', icon: Milk },
  { id: 11, name: 'Teas', icon: Leaf },
  { id: 12, name: 'Specials', icon: Star },
  { id: 13, name: 'Breakfast', icon: Egg },
  { id: 14, name: 'Combos', icon: Utensils },
  { id: 15, name: 'Alcohol', icon: Wine },
  { id: 16, name: 'Vegan', icon: Vegan },
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

  // Salads
  { id: 19, name: 'Caesar Salad', price: 8.0, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caesar salad' },
  { id: 20, name: 'Greek Salad', price: 7.5, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'greek salad' },
  
  // Soups
  { id: 21, name: 'Tomato Soup', price: 5.0, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tomato soup' },
  { id: 22, name: 'Chicken Noodle Soup', price: 5.5, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chicken soup' },
  
  // Desserts
  { id: 23, name: 'Cheesecake', price: 4.5, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'slice cheesecake' },
  { id: 24, name: 'Chocolate Cake', price: 4.5, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate cake' },

  // Frappes
  { id: 25, name: 'Caramel Frappe', price: 4.5, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caramel frappe' },
  { id: 26, name: 'Mocha Frappe', price: 4.5, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'mocha frappe' },

  // Sides
  { id: 27, name: 'French Fries', price: 3.0, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'french fries' },
  { id: 28, name: 'Onion Rings', price: 3.5, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'onion rings' },

  // Smoothies
  { id: 29, name: 'Strawberry Banana', price: 5.0, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'strawberry smoothie' },
  { id: 30, name: 'Mango Pineapple', price: 5.0, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'mango smoothie' },
  
  // Teas
  { id: 31, name: 'Green Tea', price: 2.5, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'green tea' },
  { id: 32, name: 'Black Tea', price: 2.5, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'black tea' },
  
  // Specials
  { id: 33, name: 'Daily Special', price: 9.0, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'daily special' },
  { id: 34, name: 'Soup and Sandwich', price: 10.0, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'soup sandwich' },

  // Breakfast
  { id: 35, name: 'Breakfast Burrito', price: 6.0, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'breakfast burrito' },
  { id: 36, name: 'Pancakes', price: 7.0, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'stack pancakes' },
  
  // Combos
  { id: 37, name: 'Coffee & Croissant', price: 4.0, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'coffee croissant' },
  { id: 38, name: 'Sandwich & Drink', price: 8.5, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'sandwich drink' },
  
  // Alcohol
  { id: 39, name: 'Beer', price: 5.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'beer bottle' },
  { id: 40, name: 'Wine (Glass)', price: 7.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'glass wine' },
  
  // Vegan
  { id: 41, name: 'Vegan Wrap', price: 7.0, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegan wrap' },
  { id: 42, name: 'Tofu Scramble', price: 6.5, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tofu scramble' },
];

export const tables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  status: i % 3 === 0 ? 'occupied' : i % 3 === 1 ? 'reserved' : 'available',
}));
