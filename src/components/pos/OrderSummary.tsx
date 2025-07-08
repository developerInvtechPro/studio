
'use client';

import { useState } from 'react';
import type { Order, Shift, Table } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { finalizeOrder } from '@/app/actions';
import Spinner from '../ui/spinner';


interface OrderSummaryProps {
  order: Order | null;
  isLoading: boolean;
  shift: Shift | null;
  selectedTable: Table | null;
  activeMode: 'table' | 'bar';
  onUpdateQuantity: (orderItemId: number, newQuantity: number) => Promise<void>;
  onRemoveItem: (orderItemId: number) => Promise<void>;
  onOrderFinalized: () => void;
}

export default function OrderSummary({ 
  order, 
  isLoading, 
  shift, 
  selectedTable,
  activeMode,
  onUpdateQuantity,
  onRemoveItem,
  onOrderFinalized,
}: OrderSummaryProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleCobrar = async () => {
    if (!order) return;

    setLoading(true);
    const result = await finalizeOrder(order.id);

    if (result.success && result.orderId) {
        toast({ title: '¡Venta completada!', description: `Orden #${result.orderId} ha sido finalizada.` });
        onOrderFinalized();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo finalizar la orden.' });
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>
      )
    }
    
    if (activeMode === 'table' && !selectedTable) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
                Seleccione una mesa o inicie una orden para llevar.
            </div>
        );
    }
    
    if (!order || order.items.length === 0) {
        const message = activeMode === 'bar' 
            ? 'Agregue productos para iniciar la orden para llevar.'
            : `Agregue productos para iniciar la orden de ${selectedTable?.name}.`;
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground p-8 text-center">
                {message}
            </div>
        )
    }
    
    return (
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
                {order.items.map(item => (
                <TableRow key={item.id} className="transition-all">
                    <TableCell className="font-medium py-2">{item.product.name}</TableCell>
                    <TableCell className="py-2">
                    <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    </TableCell>
                    <TableCell className="text-right py-2">L {(item.price_at_time * item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="py-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => onRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </UiTable>
    )
  }

  const getTitle = () => {
      if (activeMode === 'bar') {
          return 'Orden para Llevar';
      }
      if (selectedTable) {
          return `Consumos - ${selectedTable.name}`;
      }
      return 'Consumos';
  }

  return (
    <Card className="flex-grow flex flex-col h-full">
      <CardHeader className="py-4">
        <CardTitle className="font-headline text-lg">
            {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-full">
          <div className="px-4">
            {renderContent()}
          </div>
        </ScrollArea>
      </CardContent>
      {order && order.items.length > 0 && (
        <CardFooter className="flex-col !p-4 border-t mt-auto gap-2 bg-muted/30">
          <div className="w-full space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Sub-Total:</span>
              <span>L {order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Descuento ({order.discount_percentage}%):</span>
                <span>-L {order.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Impuesto (15%):</span>
              <span>L {order.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span className="font-headline">Total:</span>
              <span>L {order.total_amount.toFixed(2)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full font-bold text-lg h-14 mt-2" onClick={handleCobrar} disabled={loading || !shift}>
            {loading ? 'Procesando...' : 'COBRAR'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
