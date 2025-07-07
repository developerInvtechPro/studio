
'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { categories, products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export default function ProductGrid({ onProductSelect }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filteredProducts = products.filter(p => p.categoryId === activeCategory);

  return (
    <div className="flex flex-col h-full rounded-lg">
      <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
          {categories.map(category => (
            <Button 
              key={category.id} 
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className="font-headline h-12 text-xs"
            >
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollArea className="flex-grow mt-4">
          <div className="pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
              ))}
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
    </div>
  );
}
