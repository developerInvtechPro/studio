
'use client';

import { useState, useMemo } from 'react';
import type { Product, Category } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface InventoryDataTableProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function InventoryDataTable({ initialProducts, categories }: InventoryDataTableProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState('');

  const filteredProducts = useMemo(() => {
    if (!filter) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);
  
  const totalInventoryValue = useMemo(() => {
      // Use all products for total value, not just filtered ones
      return products.reduce((sum, p) => sum + (p.stock * (p.cost_price || 0)), 0);
  }, [products]);

  const formatCurrency = (amount: number) => `L ${amount.toFixed(2)}`;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Valor Total del Inventario</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalInventoryValue)}</p>
        </CardContent>
      </Card>

      <Input
        placeholder="Buscar producto por nombre..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Stock Actual</TableHead>
              <TableHead className="text-right">Costo Unitario</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => {
                const category = categories.find(c => c.id === product.categoryId);
                const totalValue = product.stock * (product.cost_price || 0);
                return (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{category?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right font-mono">{product.stock} {product.unitOfMeasureSale || 'U'}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(product.cost_price || 0)}</TableCell>
                        <TableCell className="text-right font-bold font-mono">{formatCurrency(totalValue)}</TableCell>
                    </TableRow>
                );
            }) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No se encontraron productos con ese filtro.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
