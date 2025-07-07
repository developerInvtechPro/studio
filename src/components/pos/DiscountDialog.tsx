
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const discountSchema = z.object({
  percentage: z.coerce
    .number()
    .min(0, { message: 'El descuento no puede ser negativo.' })
    .max(100, { message: 'El descuento no puede ser mayor a 100%.' }),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (percentage: number) => void;
  currentDiscount: number;
}

export default function DiscountDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  currentDiscount,
}: DiscountDialogProps) {
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      percentage: currentDiscount,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({ percentage: currentDiscount });
    }
  }, [isOpen, currentDiscount, form]);

  const handleFormSubmit = (data: DiscountFormValues) => {
    onSubmit(data.percentage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aplicar Descuento</DialogTitle>
          <DialogDescription>
            Ingrese el porcentaje de descuento que desea aplicar a toda la orden.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porcentaje de Descuento (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Aplicar Descuento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
