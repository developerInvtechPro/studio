
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveCategoryAction } from '@/app/actions';
import { iconMap } from '@/lib/icons';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  iconName: z.string({ required_error: 'Debe seleccionar un icono.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onCategorySaved: (category: Category) => void;
}

export default function CategoryFormDialog({ isOpen, onOpenChange, category, onCategorySaved }: CategoryFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      iconName: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          name: category.name,
          iconName: category.iconName,
        });
      } else {
        form.reset({
          name: '',
          iconName: undefined,
        });
      }
    }
  }, [isOpen, category, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const categoryToSave = { ...data, id: category?.id };
    const result = await saveCategoryAction(categoryToSave);
    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Categoría ${category ? 'actualizada' : 'creada'} correctamente.` });
      onCategorySaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  const availableIcons = Object.keys(iconMap);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? 'Editar Categoría' : 'Crear Categoría'}</DialogTitle>
          <DialogDescription>
            Complete los detalles de la categoría.
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
                  <FormControl><Input placeholder="Ej: Bebidas Calientes" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un icono" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableIcons.map((iconKey) => {
                        const Icon = iconMap[iconKey];
                        return (
                          <SelectItem key={iconKey} value={iconKey}>
                            <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{iconKey}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
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
