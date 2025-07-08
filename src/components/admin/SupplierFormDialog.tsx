
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Supplier } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveSupplierAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  rtn: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface SupplierFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
  onSupplierSaved: (supplier: Supplier) => void;
}

export default function SupplierFormDialog({ isOpen, onOpenChange, supplier, onSupplierSaved }: SupplierFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      rtn: '',
      phone: '',
      address: '',
      email: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (supplier) {
        form.reset({
          name: supplier.name,
          rtn: supplier.rtn || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          email: supplier.email || '',
        });
      } else {
        form.reset({
          name: '',
          rtn: '',
          phone: '',
          address: '',
          email: '',
        });
      }
    }
  }, [isOpen, supplier, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const supplierToSave = { ...data, id: supplier?.id };
    const result = await saveSupplierAction(supplierToSave);
    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Proveedor ${supplier ? 'actualizado' : 'creado'} correctamente.` });
      onSupplierSaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Editar Proveedor' : 'Crear Proveedor'}</DialogTitle>
          <DialogDescription>
            Complete los detalles del proveedor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Proveedor</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input {...field} /></FormControl>
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
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Proveedor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
