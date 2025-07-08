
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from '@/context/SessionContext';
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LogIn, ArrowRight } from 'lucide-react';

const startShiftSchema = z.object({
  startingCash: z.coerce.number().min(0, { message: 'El fondo de caja no puede ser negativo.' }),
});

type StartShiftFormValues = z.infer<typeof startShiftSchema>;

function StartShiftPage() {
  const router = useRouter();
  const { startShift, user } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<StartShiftFormValues>({
    resolver: zodResolver(startShiftSchema),
    defaultValues: {
      startingCash: 0,
    },
  });

  const onSubmit = async (data: StartShiftFormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Usuario no encontrado.' });
        return;
    }
    setLoading(true);
    try {
      await startShift(data.startingCash);
      toast({
        title: 'Turno Iniciado',
        description: `El turno ha comenzado con L ${data.startingCash.toFixed(2)} en caja.`,
      });
      router.push('/');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo iniciar el turno.',
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
             <LogIn className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Iniciar Turno</CardTitle>
          <CardDescription>
            Bienvenido, {user?.username}. Ingrese el fondo de caja para empezar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="startingCash"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fondo de Caja Inicial (L)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={loading}>
                {loading ? 'Iniciando...' : 'Iniciar Turno'}
              </Button>
            </form>
          </Form>
        </CardContent>
        {user?.role === 'admin' && (
            <CardFooter className="flex-col gap-2 border-t pt-4">
                <p className="text-xs text-muted-foreground text-center">Como administrador, también puedes ir directamente al panel de control.</p>
                <Button variant="secondary" className="w-full" onClick={() => router.push('/admin')}>
                    Ir al Panel de Administración
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function ProtectedStartShiftPage() {
    return (
        <ProtectedLayout requireAuthOnly>
            <StartShiftPage />
        </ProtectedLayout>
    )
}
