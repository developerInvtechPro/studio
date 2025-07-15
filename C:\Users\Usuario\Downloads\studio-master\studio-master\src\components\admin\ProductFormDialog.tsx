
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product, Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveProductAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '../ui/label';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre es requerido'),
  price: z.coerce.number().positive('El precio debe ser un número positivo'),
  cost_price: z.coerce.number().min(0, 'El costo no puede ser negativo').optional().nullable(),
  categoryId: z.coerce.number().min(1, 'Debe seleccionar una categoría'),
  unitOfMeasureSale: z.string().optional(),
  unitOfMeasurePurchase: z.string().optional(),
  taxRate: z.coerce.number().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  onProductSaved: (product: Product) => void;
}

export default function ProductFormDialog({ isOpen, onOpenChange, product, categories, onProductSaved }: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      taxRate: 15,
      unitOfMeasureSale: 'Unidad',
      unitOfMeasurePurchase: 'Unidad',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (product) {
        form.reset({
          name: product.name,
          price: product.price,
          cost_price: product.cost_price,
          categoryId: product.categoryId,
          unitOfMeasureSale: product.unitOfMeasureSale || 'Unidad',
          unitOfMeasurePurchase: product.unitOfMeasurePurchase || 'Unidad',
          taxRate: product.taxRate,
          isActive: product.isActive,
        });
      } else {
        form.reset({
          name: '',
          price: 0,
          cost_price: 0,
          categoryId: 0,
          unitOfMeasureSale: 'Unidad',
          unitOfMeasurePurchase: 'Unidad',
          taxRate: 15,
          isActive: true,
        });
      }
    }
  }, [isOpen, product, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const productToSave = { ...data, id: product?.id };
    const result = await saveProductAction(productToSave);
    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Producto ${product ? 'actualizado' : 'creado'} correctamente.` });
      onProductSaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Editar Producto' : 'Crear Producto'}</DialogTitle>
          <DialogDescription>
            Complete los detalles del producto.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Precio de Venta</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Costo de Compra</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value)}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Impuesto</FormLabel>
                        <Select onValueChange={field.onChange} value={String(field.value)}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione impuesto" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="0">Exento (0%)</SelectItem>
                                <SelectItem value="15">ISV (15%)</SelectItem>
                                <SelectItem value="18">ISV (18%)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="unitOfMeasureSale"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Unidad de Venta</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="unitOfMeasurePurchase"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Unidad de Compra</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''}/></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
                            <Label htmlFor="isActiveSwitch" className="mb-0">Producto Activo</Label>
                            <FormControl>
                                <Switch
                                id="isActiveSwitch"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                    />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
