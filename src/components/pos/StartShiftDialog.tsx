
'use client';

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

const startShiftSchema = z.object({
  startingCash: z.coerce.number().min(0, { message: 'El fondo de caja no puede ser negativo.' }),
});

type StartShiftFormValues = z.infer<typeof startShiftSchema>;

interface StartShiftDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (startingCash: number) => void;
  loading: boolean;
}

export default function StartShiftDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  loading,
}: StartShiftDialogProps) {
  const form = useForm<StartShiftFormValues>({
    resolver: zodResolver(startShiftSchema),
    defaultValues: {
      startingCash: 0,
    },
  });

  const handleFormSubmit = (data: StartShiftFormValues) => {
    onConfirm(data.startingCash);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Iniciar Turno</DialogTitle>
          <DialogDescription>
            Ingrese el fondo de caja inicial para comenzar a facturar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="startingCash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fondo de Caja Inicial (L)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000.00" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Iniciando..." : "Confirmar e Iniciar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
