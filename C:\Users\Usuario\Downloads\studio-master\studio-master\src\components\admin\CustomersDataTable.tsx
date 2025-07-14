
'use client';

import { useState } from 'react';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import CustomerFormDialog from './CustomerFormDialog';

interface CustomersDataTableProps {
  initialCustomers: Customer[];
}

export default function CustomersDataTable({ initialCustomers }: CustomersDataTableProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };
  
  const onCustomerSaved = (savedCustomer: Customer) => {
    const existingIndex = customers.findIndex(c => c.id === savedCustomer.id);
    if (existingIndex > -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[existingIndex] = savedCustomer;
      setCustomers(updatedCustomers);
    } else {
      setCustomers([savedCustomer, ...customers]);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir Cliente</Button>
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
            {customers.map((customer) => (
                <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.rtn || 'N/A'}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(customer)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomerFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        customer={selectedCustomer}
        onCustomerSaved={onCustomerSaved}
      />
    </>
  );
}
