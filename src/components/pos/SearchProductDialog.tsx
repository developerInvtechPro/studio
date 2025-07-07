
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { searchProductsAction } from '@/app/actions';
import type { Product } from '@/lib/types';
import Spinner from '../ui/spinner';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchProductDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onProductSelect: (product: Product) => void;
}

export default function SearchProductDialog({
  isOpen,
  onOpenChange,
  onProductSelect,
}: SearchProductDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      searchProductsAction(debouncedQuery)
        .then(setResults)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);
  
  useEffect(() => {
      if(!isOpen) {
          setQuery('');
          setResults([]);
      }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buscar Producto</DialogTitle>
          <DialogDescription>
            Escriba el nombre del producto que desea buscar.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder="Ej: Latte, Croissant..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <ScrollArea className="max-h-[50vh] border rounded-md">
          <div className="relative p-2">
            {loading && <div className="absolute inset-0 flex items-center justify-center bg-background/50"><Spinner/></div>}
            {results.length > 0 ? (
              <Table>
                <TableBody>
                  {results.map((product) => (
                    <TableRow
                      key={product.id}
                      className="cursor-pointer"
                      onClick={() => onProductSelect(product)}
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">L {product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                !loading && <p className="text-center text-sm text-muted-foreground p-4">
                    {debouncedQuery ? 'No se encontraron productos.' : 'Escriba para buscar.'}
                </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
