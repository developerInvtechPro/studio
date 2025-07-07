
import type { LucideProps } from 'lucide-react';
import {
  Coffee, Cookie, Sandwich, GlassWater, Salad, Soup, CakeSlice, IceCream2, UtensilsCrossed, Milk, Leaf, Star, Egg, Utensils, Wine, Vegan
} from 'lucide-react';

export const iconMap: { [key: string]: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>> } = {
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
  Vegan,
};
