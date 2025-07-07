
'use client';

import { useState, useEffect } from 'react';
import type { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { getCategoriesAction, getProductsByCategoryAction } from '@/app/actions';
import { iconMap } from '@/lib/icons';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export default function ProductGrid({ onProductSelect }: ProductGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoadingCategories(true);
        const cats = await getCategoriesAction();
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategory(cats[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (activeCategory === null) return;
      try {
        setLoadingProducts(true);
        const prods = await getProductsByCategoryAction(activeCategory);
        setProducts(prods);
      } catch (error) {
        console.error(`Failed to fetch products for category ${activeCategory}`, error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="flex flex-col h-full rounded-lg">
      <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
        {loadingCategories ? (
          Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))
        ) : (
          categories.map(category => {
            const Icon = iconMap[category.iconName];
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.id)}
                className="font-headline h-12 text-xs"
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {category.name}
              </Button>
            );
          })
        )}
      </div>
      <ScrollArea className="flex-grow mt-4">
        <div className="pr-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {loadingProducts ? (
              Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
              ))
            )}
          </div>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
