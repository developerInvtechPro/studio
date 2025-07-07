
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

export default function ProductCard({ product, onProductSelect }: ProductCardProps) {
  return (
    <Card
      className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300 animate-in fade-in zoom-in-95"
      onClick={() => onProductSelect(product)}
      aria-label={`Select ${product.name}`}
    >
      <CardHeader className="p-0">
        <div className="aspect-square relative w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={product.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <h3 className="font-headline font-medium text-base tracking-tight">{product.name}</h3>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <p className="text-sm font-semibold text-secondary">${product.price.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
