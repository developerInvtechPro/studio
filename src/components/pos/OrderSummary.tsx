
'use client';

import { useState } from 'react';
import type { OrderItem, Shift, Table } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createOrderAction } from '@/app/actions';


interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearOrder: () => void;
  refetchTables: () => void;
  shift: Shift | null;
  selectedTable: Table | null;
}

export default function OrderSummary({ orderItems, onUpdateQuantity, onRemoveItem, onClearOrder, refetchTables, shift, selectedTable }: OrderSummaryProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const subtotal = orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxRate = 0.15; // ISV Honduras
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleCobrar = async () => {
    if (!shift) {
        toast({ variant: 'destructive', title: 'Error', description: 'No hay un turno activo.' });
        return;
    }
    if (orderItems.length === 0) return;

    setLoading(true);
    const result = await createOrderAction({
        shiftId: shift.id,
        tableId: selectedTable?.id || null,
        items: orderItems,
        subtotal,
        tax,
        total,
        customerName: 'Consumidor Final',
    });

    if (result.success && result.orderId) {
        toast({ title: '¡Venta completada!', description: `Orden #${result.orderId} ha sido creada.` });
        onClearOrder();
        refetchTables();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo crear la orden.' });
    }
    setLoading(false);
  };

  return (
    <Card className="flex-grow flex flex-col h-full">
      <CardHeader className="py-4">
        <CardTitle className="font-headline text-lg">
            {selectedTable ? `Consumos - ${selectedTable.name}` : 'Consumos'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-full">
          <div className="px-4">
            {orderItems.length > 0 ? (
              <UiTable>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Descripción</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map(item => (
                    <TableRow key={item.id} className="transition-all">
                      <TableCell className="font-medium py-2">{item.product.name}</TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-2">L {(item.product.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell className="py-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => onRemoveItem(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </UiTable>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">Seleccione productos en el panel de la derecha para iniciar una orden.</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      {orderItems.length > 0 && (
        <CardFooter className="flex-col !p-4 border-t mt-auto gap-2 bg-muted/30">
          <div className="w-full space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Sub-Total:</span>
              <span>L {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto ({(taxRate * 100).toFixed(0)}%):</span>
              <span>L {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span className="font-headline">Total:</span>
              <span>L {total.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full font-bold text-lg h-14 mt-2" onClick={handleCobrar} disabled={loading || !shift || orderItems.length === 0}>
            {loading ? 'Procesando...' : 'COBRAR'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
