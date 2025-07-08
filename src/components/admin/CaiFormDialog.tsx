'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';
import type { CaiRecord } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { saveCaiRecordAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const rangeRegex = /^\d{3}-\d{3}-\d{2}-\d{8}$/;

const formSchema = z.object({
  cai: z.string().min(1, 'El CAI es requerido'),
  range_start: z.string().regex(rangeRegex, "El formato debe ser 000-000-00-00000000."),
  range_end: z.string().regex(rangeRegex, "El formato debe ser 000-000-00-00000000."),
  issue_date: z.date({ required_error: 'La fecha de emisión es requerida' }),
  expiration_date: z.date({ required_error: 'La fecha límite de emisión es requerida' }),
  status: z.enum(['active', 'pending', 'inactive'], {
    required_error: "Debe seleccionar un estado.",
  }),
}).refine(data => {
    const start = parseInt(data.range_start.replace(/-/g, ''), 10);
    const end = parseInt(data.range_end.replace(/-/g, ''), 10);
    return !isNaN(start) && !isNaN(end) && end > start;
}, {
    message: "El rango final debe ser mayor que el rango inicial.",
    path: ["range_end"],
});

type FormValues = z.infer<typeof formSchema>;

interface CaiFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caiRecord: CaiRecord | null;
  onRecordSaved: (record: CaiRecord) => void;
}

export default function CaiFormDialog({ isOpen, onOpenChange, caiRecord, onRecordSaved }: CaiFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (caiRecord) {
        form.reset({
          cai: caiRecord.cai,
          range_start: caiRecord.range_start,
          range_end: caiRecord.range_end,
          issue_date: parseISO(caiRecord.issue_date),
          expiration_date: parseISO(caiRecord.expiration_date),
          status: caiRecord.status,
        });
      } else {
        form.reset({
          cai: '',
          range_start: '',
          range_end: '',
          issue_date: new Date(),
          expiration_date: undefined,
          status: 'pending',
        });
      }
    }
  }, [isOpen, caiRecord, form]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const recordToSave = { 
        id: caiRecord?.id,
        cai: data.cai,
        range_start: data.range_start,
        range_end: data.range_end,
        issue_date: data.issue_date.toISOString(),
        expiration_date: data.expiration_date.toISOString(),
        status: data.status,
    };
    
    const result = await saveCaiRecordAction(recordToSave);
    if (result.success && result.data) {
      toast({ title: 'Éxito', description: `Registro CAI ${caiRecord ? 'actualizado' : 'creado'} correctamente.` });
      onRecordSaved(result.data);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{caiRecord ? 'Editar CAI' : 'Crear CAI'}</DialogTitle>
          <DialogDescription>
            Complete la información del registro de autorización.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
            <FormField
              control={form.control}
              name="cai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Autorización (CAI)</FormLabel>
                  <FormControl><Textarea placeholder="XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XX" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="range_start"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rango Inicial</FormLabel>
                    <FormControl><Input type="text" placeholder="000-000-00-00000000" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="range_end"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rango Final</FormLabel>
                    <FormControl><Input type="text" placeholder="000-000-00-00000000" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Emisión</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Seleccione una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha Límite de Emisión</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Seleccione una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar CAI'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
