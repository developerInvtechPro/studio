
'use client';

import { useState, useEffect } from 'react';
import type { Shift, CompletedOrderInfo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { getCompletedOrdersForShiftAction } from '@/app/actions';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

interface HistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shift: Shift | null;
  onViewDetails: (orderId: number) => void;
}

export default function HistoryDialog({ isOpen, onOpenChange, shift, onViewDetails }: HistoryDialogProps) {
    const [orders, setOrders] = useState<CompletedOrderInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchHistory() {
            if (isOpen && shift) {
                setLoading(true);
                const result = await getCompletedOrdersForShiftAction(shift.id);
                if (result.success && result.data) {
                    setOrders(result.data);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error });
                }
                setLoading(false);
            }
        }
        fetchHistory();
    }, [isOpen, shift, toast]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Historial de Facturas (Turno #{shift?.id})</DialogTitle>
                    <DialogDescription>
                        Facturas completadas en el turno actual. Haga clic en una para ver el detalle.
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
                                    <TableHead>Factura #</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id} className="cursor-pointer" onClick={() => onViewDetails(order.id)}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.customer_name || 'Consumidor Final'}</TableCell>
                                        <TableCell>{new Date(order.created_at).toLocaleTimeString()}</TableCell>
                                        <TableCell className="text-right">L {order.total_amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground p-4">No hay facturas completadas en este turno.</p>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
