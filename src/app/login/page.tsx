'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from '@/context/SessionContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Coffee } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const loggedInUser = await login(data.username, data.password);
      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente.',
      });
      
      if (loggedInUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/start-shift');
      }

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error de autenticación',
        description: 'Las credenciales son incorrectas. Por favor, inténtelo de nuevo.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Coffee className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Café Central POS</CardTitle>
          <CardDescription>Ingrese sus credenciales para comenzar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
