
'use client';

import { useState } from 'react';
import type { Supplier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import SupplierFormDialog from './SupplierFormDialog';

interface SuppliersDataTableProps {
  initialSuppliers: Supplier[];
}

export default function SuppliersDataTable({ initialSuppliers }: SuppliersDataTableProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const handleAddNew = () => {
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };
  
  const onSupplierSaved = (savedSupplier: Supplier) => {
    const existingIndex = suppliers.findIndex(p => p.id === savedSupplier.id);
    if (existingIndex > -1) {
      const updatedSuppliers = [...suppliers];
      updatedSuppliers[existingIndex] = savedSupplier;
      setSuppliers(updatedSuppliers);
    } else {
      setSuppliers([savedSupplier, ...suppliers]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir Proveedor</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>RTN</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.rtn || 'N/A'}</TableCell>
                    <TableCell>{supplier.phone || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SupplierFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        supplier={selectedSupplier}
        onSupplierSaved={onSupplierSaved}
      />
    </>
  );
}
