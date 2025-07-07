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
  // Category 1: Coffee
  { id: 1, name: 'Espresso', price: 2.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'espresso shot' },
  { id: 2, name: 'Latte', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'latte art' },
  { id: 3, name: 'Cappuccino', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cappuccino foam' },
  { id: 4, name: 'Americano', price: 3.0, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'black coffee' },
  { id: 5, name: 'Mocha', price: 4.0, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate coffee' },
  { id: 101, name: 'Macchiato', price: 3.25, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'espresso macchiato' },
  { id: 102, name: 'Flat White', price: 3.75, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'flat white' },
  { id: 103, name: 'Iced Coffee', price: 3.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced coffee' },
  { id: 104, name: 'Cold Brew', price: 4.25, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cold brew' },
  { id: 105, name: 'Affogato', price: 4.5, categoryId: 1, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'affogato dessert' },

  // Category 2: Pastries
  { id: 6, name: 'Croissant', price: 2.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'buttery croissant' },
  { id: 7, name: 'Muffin', price: 2.5, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'blueberry muffin' },
  { id: 8, name: 'Cinnamon Roll', price: 3.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced cinnamon' },
  { id: 9, name: 'Scone', price: 2.75, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cranberry scone' },
  { id: 10, name: 'Pain au Chocolat', price: 2.5, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate pastry' },
  { id: 201, name: 'Apple Turnover', price: 3.25, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'apple turnover' },
  { id: 202, name: 'Danish', price: 3.0, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cheese danish' },
  { id: 203, name: 'Donut', price: 1.75, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'glazed donut' },
  { id: 204, name: 'Biscotti', price: 1.5, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'almond biscotti' },
  { id: 205, name: 'Cookie', price: 1.25, categoryId: 2, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate chip' },

  // Category 3: Sandwiches
  { id: 11, name: 'Turkey Club', price: 7.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'turkey sandwich' },
  { id: 12, name: 'Ham & Cheese', price: 6.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'ham cheese' },
  { id: 13, name: 'Veggie Delight', price: 6.0, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegetable sandwich' },
  { id: 14, name: 'Chicken Salad', price: 7.0, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chicken salad' },
  { id: 301, name: 'BLT', price: 6.75, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'bacon lettuce' },
  { id: 302, name: 'Roast Beef', price: 8.0, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'roast beef' },
  { id: 303, name: 'Caprese', price: 7.25, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caprese panini' },
  { id: 304, name: 'Tuna Melt', price: 7.0, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tuna melt' },
  { id: 305, name: 'Grilled Cheese', price: 5.5, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'grilled cheese' },
  { id: 306, name: 'Italian Sub', price: 8.25, categoryId: 3, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'italian sub' },
  
  // Category 4: Drinks
  { id: 15, name: 'Orange Juice', price: 3.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'fresh juice' },
  { id: 16, name: 'Iced Tea', price: 2.5, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced tea' },
  { id: 17, name: 'Bottled Water', price: 1.5, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'water bottle' },
  { id: 18, name: 'Sparkling Water', price: 2.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'sparkling water' },
  { id: 401, name: 'Lemonade', price: 3.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'fresh lemonade' },
  { id: 402, name: 'Soda', price: 2.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'soda can' },
  { id: 403, name: 'Milk', price: 2.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'glass milk' },
  { id: 404, name: 'Chocolate Milk', price: 2.5, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate milk' },
  { id: 405, name: 'Kombucha', price: 4.0, categoryId: 4, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'kombucha bottle' },

  // Category 5: Salads
  { id: 19, name: 'Caesar Salad', price: 8.0, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caesar salad' },
  { id: 20, name: 'Greek Salad', price: 7.5, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'greek salad' },
  { id: 501, name: 'Cobb Salad', price: 9.0, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'cobb salad' },
  { id: 502, name: 'Garden Salad', price: 6.5, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'garden salad' },
  { id: 503, name: 'Spinach Salad', price: 8.5, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'spinach salad' },
  { id: 504, name: 'Quinoa Salad', price: 9.5, categoryId: 5, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'quinoa salad' },

  // Category 6: Soups
  { id: 21, name: 'Tomato Soup', price: 5.0, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tomato soup' },
  { id: 22, name: 'Chicken Noodle', price: 5.5, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chicken soup' },
  { id: 601, name: 'Broccoli Cheddar', price: 5.5, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'broccoli soup' },
  { id: 602, name: 'French Onion', price: 6.0, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'onion soup' },
  { id: 603, name: 'Lentil Soup', price: 5.0, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'lentil soup' },
  { id: 604, name: 'Clam Chowder', price: 6.5, categoryId: 6, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'clam chowder' },
  
  // Category 7: Desserts
  { id: 23, name: 'Cheesecake', price: 4.5, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'slice cheesecake' },
  { id: 24, name: 'Chocolate Cake', price: 4.5, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chocolate cake' },
  { id: 701, name: 'Tiramisu', price: 5.0, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tiramisu' },
  { id: 702, name: 'Apple Pie', price: 4.0, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'apple pie' },
  { id: 703, name: 'Brownie', price: 3.0, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'fudge brownie' },
  { id: 704, name: 'Ice Cream Scoop', price: 2.5, categoryId: 7, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'ice cream' },
  
  // Category 8: Frappes
  { id: 25, name: 'Caramel Frappe', price: 4.5, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'caramel frappe' },
  { id: 26, name: 'Mocha Frappe', price: 4.5, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'mocha frappe' },
  { id: 801, name: 'Coffee Frappe', price: 4.0, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'coffee frappe' },
  { id: 802, name: 'Vanilla Bean Frappe', price: 4.25, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vanilla frappe' },
  { id: 803, name: 'Strawberry Frappe', price: 4.5, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'strawberry frappe' },
  { id: 804, name: 'Matcha Frappe', price: 5.0, categoryId: 8, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'matcha frappe' },

  // Category 9: Sides
  { id: 27, name: 'French Fries', price: 3.0, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'french fries' },
  { id: 28, name: 'Onion Rings', price: 3.5, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'onion rings' },
  { id: 901, name: 'Side Salad', price: 3.5, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'side salad' },
  { id: 902, name: 'Fruit Cup', price: 4.0, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'fruit cup' },
  { id: 903, name: 'Chips', price: 1.5, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'potato chips' },
  { id: 904, name: 'Breadsticks', price: 2.5, categoryId: 9, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'garlic breadsticks' },
  
  // Category 10: Smoothies
  { id: 29, name: 'Strawberry Banana', price: 5.0, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'strawberry smoothie' },
  { id: 30, name: 'Mango Pineapple', price: 5.0, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'mango smoothie' },
  { id: 1001, name: 'Green Smoothie', price: 5.5, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'green smoothie' },
  { id: 1002, name: 'Berry Blast', price: 5.25, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'mixed berry' },
  { id: 1003, name: 'Peanut Butter', price: 5.5, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'peanut butter' },
  { id: 1004, name: 'Tropical Paradise', price: 5.25, categoryId: 10, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tropical smoothie' },
  
  // Category 11: Teas
  { id: 31, name: 'Green Tea', price: 2.5, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'green tea' },
  { id: 32, name: 'Black Tea', price: 2.5, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'black tea' },
  { id: 1101, name: 'Herbal Tea', price: 2.5, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'herbal tea' },
  { id: 1102, name: 'Chai Latte', price: 4.0, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'chai latte' },
  { id: 1103, name: 'Iced Green Tea', price: 3.0, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'iced green' },
  { id: 1104, name: 'Earl Grey', price: 2.75, categoryId: 11, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'earl grey' },
  
  // Category 12: Specials
  { id: 33, name: 'Daily Special', price: 9.0, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'daily special' },
  { id: 34, name: 'Soup of the Day', price: 4.5, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'soup special' },
  { id: 1201, name: 'Quiche of the Day', price: 6.5, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'quiche slice' },
  { id: 1202, name: 'Chef\'s Pasta', price: 11.0, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'pasta special' },
  { id: 1203, name: 'Sandwich Special', price: 8.0, categoryId: 12, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'sandwich special' },

  // Category 13: Breakfast
  { id: 35, name: 'Breakfast Burrito', price: 6.0, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'breakfast burrito' },
  { id: 36, name: 'Pancakes', price: 7.0, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'stack pancakes' },
  { id: 1301, name: 'Oatmeal', price: 4.5, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'oatmeal bowl' },
  { id: 1302, name: 'Bagel with Cream Cheese', price: 3.5, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'bagel cream' },
  { id: 1303, name: 'Breakfast Sandwich', price: 5.5, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'egg sandwich' },
  { id: 1304, name: 'French Toast', price: 7.5, categoryId: 13, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'french toast' },
  
  // Category 14: Combos
  { id: 37, name: 'Coffee & Croissant', price: 4.0, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'coffee croissant' },
  { id: 38, name: 'Soup & Sandwich', price: 10.0, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'soup sandwich' },
  { id: 1401, name: 'Salad & Drink', price: 9.5, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'salad drink' },
  { id: 1402, name: 'Breakfast Combo', price: 8.0, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'breakfast combo' },
  { id: 1403, name: 'Dessert & Coffee', price: 6.0, categoryId: 14, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'dessert coffee' },

  // Category 15: Alcohol
  { id: 39, name: 'Beer (Local)', price: 5.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'craft beer' },
  { id: 40, name: 'Wine (Glass)', price: 7.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'glass wine' },
  { id: 1501, name: 'Mimosa', price: 8.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'mimosa cocktail' },
  { id: 1502, name: 'Bloody Mary', price: 8.5, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'bloody mary' },
  { id: 1503, name: 'Beer (Import)', price: 6.0, categoryId: 15, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'import beer' },
  
  // Category 16: Vegan
  { id: 41, name: 'Vegan Wrap', price: 7.0, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegan wrap' },
  { id: 42, name: 'Tofu Scramble', price: 6.5, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'tofu scramble' },
  { id: 1601, name: 'Vegan Burger', price: 8.5, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegan burger' },
  { id: 1602, name: 'Vegan Chili', price: 6.0, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegan chili' },
  { id: 1603, name: 'Vegan Muffin', price: 3.0, categoryId: 16, imageUrl: 'https://placehold.co/200x200.png', imageHint: 'vegan muffin' },
];

export const tables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  status: i % 3 === 0 ? 'occupied' : i % 3 === 1 ? 'reserved' : 'available',
}));
