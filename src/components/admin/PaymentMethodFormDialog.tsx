
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PaymentMethod } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { savePaymentMethodAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  type: z.enum(['cash', 'card', 'transfer', 'other'], {
    required_error: "Debe seleccionar un tipo.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentMethodFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  method: PaymentMethod | null;
  onMethodSaved: (method: PaymentMethod) => void;
}

export default function PaymentMethodFormDialog({ isOpen, onOpenChange, method, onMethodSaved }: PaymentMethodFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'card',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (method) {
        form.reset({
          name: method.name,
          type: method.type,
        });
      } else {
        form.reset({
          name: '',
          type: 'card',
        });
      }
    }
  }, [isOpen, method, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const methodToSave = { ...data, id: method?.id };
    const result = await savePaymentMethodAction(methodToSave);
    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Medio de pago ${method ? 'actualizado' : 'creado'} correctamente.` });
      onMethodSaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{method ? 'Editar Medio de Pago' : 'Crear Medio de Pago'}</DialogTitle>
          <DialogDescription>
            Complete los detalles del medio de pago.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input placeholder="Ej: Tarjeta BAC" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Efectivo</SelectItem>
                      <SelectItem value="card">Tarjeta</SelectItem>
                      <SelectItem value="transfer">Transferencia</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
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
