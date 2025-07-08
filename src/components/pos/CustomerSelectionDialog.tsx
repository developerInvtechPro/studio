
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import Spinner from '@/components/ui/spinner';
import { searchCustomersAction } from '@/app/actions';
import CreateCustomerDialog from './CreateCustomerDialog';

interface CustomerSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCustomerSelect: (customer: Customer) => void;
}

export default function CustomerSelectionDialog({ isOpen, onOpenChange, onCustomerSelect }: CustomerSelectionDialogProps) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateCustomerOpen, setCreateCustomerOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setLoading(true);
    searchCustomersAction(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debouncedQuery, isOpen]);
  
  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);
  
  const handleCustomerCreated = (newCustomer: Customer) => {
    setResults([newCustomer, ...results]);
    setCreateCustomerOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Cliente</DialogTitle>
            <DialogDescription>
              Busque un cliente por nombre o RTN, o cree uno nuevo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 py-2">
            <Input
              placeholder="Buscar por Nombre o RTN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <Button onClick={() => setCreateCustomerOpen(true)}>Crear Nuevo</Button>
          </div>
          <ScrollArea className="h-[50vh] border rounded-md">
            <div className="relative p-2">
              {loading && <div className="absolute inset-0 flex items-center justify-center bg-background/50"><Spinner/></div>}
              {results.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>RTN</TableHead>
                      <TableHead>Teléfono</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="cursor-pointer"
                        onClick={() => onCustomerSelect(customer)}
                      >
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.rtn}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                  !loading && <p className="text-center text-sm text-muted-foreground p-4">
                      {debouncedQuery ? 'No se encontraron clientes.' : 'Mostrando clientes recientes. Escriba para buscar.'}
                  </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <CreateCustomerDialog
        isOpen={isCreateCustomerOpen}
        onOpenChange={setCreateCustomerOpen}
        onCustomerCreated={handleCustomerCreated}
      />
    </>
  );
}
