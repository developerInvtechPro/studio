
'use client';

import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

export default function ProductCard({ product, onProductSelect }: ProductCardProps) {
  return (
    <Button
      variant="default"
      className="h-16 justify-center items-center text-center whitespace-normal p-1 leading-tight"
      onClick={() => onProductSelect(product)}
      aria-label={`Select ${product.name}`}
    >
      <span className="text-[11px] font-medium uppercase">{product.name}</span>
    </Button>
  );
}
