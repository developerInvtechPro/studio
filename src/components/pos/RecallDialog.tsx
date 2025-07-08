
'use client';

import { useState, useEffect } from 'react';
import type { Shift, CompletedOrderInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { getSuspendedOrdersAction } from '@/app/actions';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

interface RecallDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shift: Shift | null;
  onRecallOrder: (orderId: number) => void;
}

export default function RecallDialog({ isOpen, onOpenChange, shift, onRecallOrder }: RecallDialogProps) {
    const [orders, setOrders] = useState<CompletedOrderInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchSuspended() {
            if (isOpen && shift) {
                setLoading(true);
                const result = await getSuspendedOrdersAction(shift.id);
                if (result.success && result.data) {
                    setOrders(result.data);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error });
                }
                setLoading(false);
            }
        }
        fetchSuspended();
    }, [isOpen, shift, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Llamar Venta Suspendida</DialogTitle>
                    <DialogDescription>
                        Seleccione una venta para restaurarla en modo "Para Llevar".
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] border rounded-md">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Spinner />
                        </div>
                    ) : orders.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Orden #</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Suspendida</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} className="cursor-pointer" onClick={() => onRecallOrder(order.id)}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer_name || 'Consumidor Final'}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleTimeString()}</TableCell>
                                        <TableCell className="text-right">L {order.total_amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground p-4">No hay ventas suspendidas en este turno.</p>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
