
'use client';

import { useState } from 'react';
import type { PaymentMethod } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import PaymentMethodFormDialog from './PaymentMethodFormDialog';

interface PaymentMethodsDataTableProps {
  initialMethods: PaymentMethod[];
}

export default function PaymentMethodsDataTable({ initialMethods }: PaymentMethodsDataTableProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleAddNew = () => {
    setSelectedMethod(null);
    setDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setDialogOpen(true);
  };
  
  const onMethodSaved = (savedMethod: PaymentMethod) => {
    const existingIndex = methods.findIndex(p => p.id === savedMethod.id);
    if (existingIndex > -1) {
      const updatedMethods = [...methods];
      updatedMethods[existingIndex] = savedMethod;
      setMethods(updatedMethods);
    } else {
      setMethods([savedMethod, ...methods]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir Medio de Pago</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method) => (
                <TableRow key={method.id}>
                    <TableCell className="font-medium">{method.name}</TableCell>
                    <TableCell className="capitalize">{method.type}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(method)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaymentMethodFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        method={selectedMethod}
        onMethodSaved={onMethodSaved}
      />
    </>
  );
}
