
'use client';

import { useState } from 'react';
import type { Product, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import ProductFormDialog from './ProductFormDialog';

interface ProductsDataTableProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsDataTable({ initialProducts, categories }: ProductsDataTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };
  
  const onProductSaved = (savedProduct: Product) => {
    const existingIndex = products.findIndex(p => p.id === savedProduct.id);
    if (existingIndex > -1) {
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = savedProduct;
      setProducts(updatedProducts);
    } else {
      setProducts([savedProduct, ...products]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir Producto</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
                const category = categories.find(c => c.id === product.categoryId);
                return (
                    <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{category?.name || 'N/A'}</TableCell>
                        <TableCell className="text-right">L {product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={product.isActive ? 'default' : 'destructive'}>
                                {product.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>
      <ProductFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        categories={categories}
        onProductSaved={onProductSaved}
      />
    </>
  );
}
