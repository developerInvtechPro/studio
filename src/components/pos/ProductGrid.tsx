
'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { categories, products } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from './ProductCard';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export default function ProductGrid({ onProductSelect }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filteredProducts = products.filter(p => p.categoryId === activeCategory);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <Tabs defaultValue={String(categories[0].id)} onValueChange={(value) => setActiveCategory(Number(value))} className="p-4 flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={String(category.id)} className="font-headline">
              <category.icon className="mr-2 h-4 w-4" />
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollArea className="flex-grow mt-4">
          <div className="pr-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
              ))}
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </Tabs>
    </div>
  );
}
