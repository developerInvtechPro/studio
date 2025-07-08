
'use client';

import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer } from 'lucide-react';
import { Separator } from '../ui/separator';

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order | null;
}

export default function InvoiceDialog({ isOpen, onOpenChange, order }: InvoiceDialogProps) {
    if (!order) return null;

    const handlePrint = () => {
        // A simple print solution. More advanced solutions might involve creating a dedicated print CSS.
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md print:shadow-none print:border-none">
                <div id="invoice-content" className="print:p-0">
                    <DialogHeader className="text-center print:text-left">
                        <DialogTitle className="text-2xl font-bold">Café Central</DialogTitle>
                        <DialogDescription>
                            Factura Simplificada
                        </DialogDescription>
                        <Separator className="my-2" />
                    </DialogHeader>
                    <div className="text-xs space-y-1 my-4">
                        <p><strong>Factura #:</strong> {order.id}</p>
                        <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString('es-HN')}</p>
                        <p><strong>Cliente:</strong> {order.customer_name || 'Consumidor Final'}</p>
                    </div>
                    <ScrollArea className="max-h-[40vh] border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cant.</TableHead>
                                    <TableHead>Producto</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell className="text-right">L {(item.quantity * item.price_at_time).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                    <div className="mt-4 space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>L {order.subtotal.toFixed(2)}</span>
                        </div>
                         {order.discount_amount > 0 && (
                            <div className="flex justify-between text-destructive">
                                <span>Descuento ({order.discount_percentage}%):</span>
                                <span>-L {order.discount_amount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>ISV (15%):</span>
                            <span>L {order.tax_amount.toFixed(2)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold text-base">
                            <span>TOTAL:</span>
                            <span>L {order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4 print:hidden">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                    <Button type="button" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
