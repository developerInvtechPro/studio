
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveUserAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
  role: z.enum(['admin', 'cashier'], {
    required_error: "Debe seleccionar un rol.",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: Omit<User, 'password'> | null;
  onUserSaved: (user: Omit<User, 'password'>) => void;
}

export default function UserFormDialog({ isOpen, onOpenChange, user, onUserSaved }: UserFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset({
          username: user.username,
          role: user.role,
          password: '',
          confirmPassword: '',
        });
      } else {
        form.reset({
          username: '',
          role: 'cashier',
          password: '',
          confirmPassword: '',
        });
      }
    }
  }, [isOpen, user, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user && !data.password) {
        form.setError("password", { message: "La contraseña es requerida para nuevos usuarios."});
        return;
    }

    setLoading(true);
    const userToSave: Partial<User> = { 
        id: user?.id,
        username: data.username,
        role: data.role,
    };
    if (data.password) {
        userToSave.password = data.password;
    }
    
    const result = await saveUserAction(userToSave);
    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Usuario ${user ? 'actualizado' : 'creado'} correctamente.` });
      onUserSaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
          <DialogDescription>
            Complete los detalles del usuario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl><Input type="password" placeholder={user ? "Dejar en blanco para no cambiar" : ""} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="cashier">Cajero</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
