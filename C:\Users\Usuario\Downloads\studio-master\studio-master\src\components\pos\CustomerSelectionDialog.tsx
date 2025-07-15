
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import type { Customer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import Spinner from '@/components/ui/spinner';
import { searchCustomersAction } from '@/app/actions';
import CreateCustomerDialog from './CreateCustomerDialog';
import CustomerFormDialog from '@/components/shared/CustomerFormDialog';
import { Edit } from 'lucide-react';

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
  const [isEditCustomerOpen, setEditCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    searchCustomersAction(debouncedQuery)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) return;
    fetchCustomers();
  }, [debouncedQuery, isOpen, fetchCustomers]);
  
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
  
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditCustomerOpen(true);
  };

  const onCustomerSaved = (savedCustomer: Customer) => {
    const existingIndex = results.findIndex(c => c.id === savedCustomer.id);
    if (existingIndex > -1) {
      const updatedCustomers = [...results];
      updatedCustomers[existingIndex] = savedCustomer;
      setResults(updatedCustomers);
    } else {
      setResults([savedCustomer, ...results]);
    }
    setEditCustomerOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Cliente</DialogTitle>
            <DialogDescription>
              Busque un cliente por nombre o RTN, o cree/edite uno.
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
                      <TableHead className="text-right">Acciones</TableHead>
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
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); handleEditCustomer(customer); }}
                          >
                              <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
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

      <CustomerFormDialog
        isOpen={isEditCustomerOpen}
        onOpenChange={setEditCustomerOpen}
        customer={selectedCustomer}
        onCustomerSaved={onCustomerSaved}
      />
    </>
  );
}
