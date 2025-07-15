
'use client';

import { useState } from 'react';
import type { Supplier } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import PurchaseInvoiceForm from './PurchaseInvoiceForm';

interface PurchaseInvoicesListProps {
  initialInvoices: any[]; // Define a proper type later
  suppliers: Supplier[];
}

export default function PurchaseInvoicesList({ initialInvoices, suppliers }: PurchaseInvoicesListProps) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [isFormOpen, setFormOpen] = useState(false);

  const onInvoiceSaved = () => {
    // For now, just close the form. A real app would refetch.
    setFormOpen(false);
    // Ideally, we'd refetch the list here.
    window.location.reload(); 
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Compra
        </Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Factura #</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                    <TableCell>{format(new Date(invoice.invoice_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="font-medium">{invoice.supplier_name}</TableCell>
                    <TableCell>{invoice.invoice_number || 'N/A'}</TableCell>
                    <TableCell className="text-right">L {invoice.total_amount.toFixed(2)}</TableCell>
                </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No hay facturas de compra registradas.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PurchaseInvoiceForm
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        suppliers={suppliers}
        onInvoiceSaved={onInvoiceSaved}
      />
    </>
  );
}
