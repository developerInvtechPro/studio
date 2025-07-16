
'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useDebounce } from '@/hooks/use-debounce';
import type { Supplier, Product, PurchaseInvoiceItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { savePurchaseInvoiceAction, searchAllProductsAction } from '@/app/actions';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { CalendarIcon, Check, ChevronsUpDown, Trash2, PlusCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Spinner from '../ui/spinner';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  supplierId: z.coerce.number({ required_error: 'Debe seleccionar un proveedor.' }),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.date({ required_error: 'La fecha de factura es requerida.' }),
  items: z.array(z.object({
    productId: z.number(),
    productName: z.string(),
    quantity: z.coerce.number().positive("La cantidad debe ser mayor a 0."),
    cost: z.coerce.number().min(0, "El costo no puede ser negativo."),
  })).min(1, 'Debe añadir al menos un producto.'),
});

type FormValues = z.infer<typeof formSchema>;

interface PurchaseInvoiceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  onInvoiceSaved: () => void;
}

export default function PurchaseInvoiceForm({ isOpen, onOpenChange, suppliers, onInvoiceSaved }: PurchaseInvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [productQuery, setProductQuery] = useState('');
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const debouncedProductQuery = useDebounce(productQuery, 300);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
      invoiceDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  useEffect(() => {
    async function searchProducts() {
        if (debouncedProductQuery) {
            setProductSearchLoading(true);
            const results = await searchAllProductsAction(debouncedProductQuery);
            setProductResults(results);
            setProductSearchLoading(false);
        } else {
            setProductResults([]);
        }
    }
    searchProducts();
  }, [debouncedProductQuery]);

  const addProductToForm = (product: Product) => {
    // Check if product is already in the list
    if (fields.some(item => item.productId === product.id)) {
        toast({
            variant: 'destructive',
            title: 'Producto Duplicado',
            description: 'Este producto ya está en la factura.',
        });
        return;
    }
    append({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        cost: product.cost_price || 0,
    });
    setProductQuery('');
    setProductResults([]);
  }

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const invoiceToSave = {
        supplier: { id: data.supplierId } as Supplier,
        invoiceNumber: data.invoiceNumber || '',
        invoiceDate: data.invoiceDate,
        items: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            cost: item.cost,
        }))
    };
    
    const result = await savePurchaseInvoiceAction(invoiceToSave);
    if (result.success) {
      toast({ title: 'Éxito', description: `Factura de compra registrada correctamente.` });
      onInvoiceSaved();
      form.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };
  
  const totalAmount = form.watch('items').reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Registrar Factura de Compra</DialogTitle>
          <DialogDescription>
            Ingrese los detalles de la factura para registrar la compra y actualizar el inventario.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="supplierId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Proveedor</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value
                                    ? suppliers.find(
                                        (s) => s.id === field.value
                                    )?.name
                                    : "Seleccione un proveedor"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                               <Command>
                                 <CommandInput placeholder="Buscar proveedor..." />
                                 <CommandEmpty>No se encontró el proveedor.</CommandEmpty>
                                 <CommandGroup>
                                   {suppliers.map((s) => (
                                     <CommandItem
                                       value={s.name}
                                       key={s.id}
                                       onSelect={() => form.setValue("supplierId", s.id)}
                                     >
                                       <Check
                                         className={cn(
                                           "mr-2 h-4 w-4",
                                           s.id === field.value ? "opacity-100" : "opacity-0"
                                         )}
                                       />
                                       {s.name}
                                     </CommandItem>
                                   ))}
                                 </CommandGroup>
                               </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Factura</FormLabel>
                            <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
               
                <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Factura</FormLabel>
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
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <Separator />
            
            <div>
                <Label>Añadir Productos</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Input
                            placeholder="Buscar producto para añadir..."
                            value={productQuery}
                            onChange={(e) => setProductQuery(e.target.value)}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command>
                            <CommandList>
                                {productSearchLoading && <div className="p-2"><Spinner size="sm" /></div>}
                                {!productSearchLoading && productResults.length === 0 ? (
                                    <CommandEmpty>No se encontraron productos.</CommandEmpty>
                                ) : (
                                    productResults.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => addProductToForm(product)}
                                            className="cursor-pointer"
                                        >
                                            {product.name}
                                        </CommandItem>
                                    ))
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <ScrollArea className="h-64 border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-2/5">Producto</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Costo Unit.</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.length > 0 ? fields.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>
                                    <Controller
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => <Input type="number" step="0.01" {...field} className="h-8"/>}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Controller
                                        control={form.control}
                                        name={`items.${index}.cost`}
                                        render={({ field }) => <Input type="number" step="0.01" {...field} className="h-8"/>}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    L {(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.cost`) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">Añada productos a la factura.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
            <div className="flex justify-end font-bold text-lg">
                <span>Total: L {totalAmount.toFixed(2)}</span>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => { form.reset(); onOpenChange(false); }}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Compra'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
