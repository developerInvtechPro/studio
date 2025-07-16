
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Customer } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveCustomerAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  rtn: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onCustomerSaved: (customer: Customer) => void;
}

export default function CustomerFormDialog({ isOpen, onOpenChange, customer, onCustomerSaved }: CustomerFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (customer) {
        form.reset({
          name: customer.name,
          rtn: customer.rtn || '',
          phone: customer.phone || '',
          address: customer.address || '',
        });
      } else {
        form.reset({
          name: '',
          rtn: '',
          phone: '',
          address: '',
        });
      }
    }
  }, [isOpen, customer, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const customerToSave = { 
        ...data, 
        id: customer?.id 
    };
    
    const result = await saveCustomerAction(customerToSave);

    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Cliente ${customer ? 'actualizado' : 'creado'} correctamente.` });
      onCustomerSaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar Cliente' : 'Crear Cliente'}</DialogTitle>
          <DialogDescription>
            Complete los detalles del cliente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre o Razón Social</FormLabel>
                  <FormControl><Input placeholder="Ej: Juan Pérez" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rtn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RTN</FormLabel>
                  <FormControl><Input placeholder="0801..." {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl><Input placeholder="+504..." {...field} value={field.value ?? ''}/></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl><Textarea placeholder="Dirección completa..." {...field} value={field.value ?? ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    