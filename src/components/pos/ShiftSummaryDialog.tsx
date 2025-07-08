
'use client';

import { useState, useEffect } from 'react';
import type { Shift, PaymentMethod } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { getShiftSummaryAction } from '@/app/actions';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';

interface ShiftSummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shift: Shift | null;
}

interface SummaryData {
    totalSales: number;
    totalOrders: number;
    totalDiscounts: number;
    salesByPaymentMethod: { name: string; total: number }[];
    startingCash: number;
    cashSales: number;
    expectedCash: number;
}

export default function ShiftSummaryDialog({ isOpen, onOpenChange, shift }: ShiftSummaryDialogProps) {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchSummary() {
            if (isOpen && shift) {
                setLoading(true);
                const result = await getShiftSummaryAction(shift.id);
                if (result.success && result.data) {
                    setSummary(result.data);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: result.error });
                }
                setLoading(false);
            }
        }
        fetchSummary();
    }, [isOpen, shift, toast]);

    const formatCurrency = (amount: number) => `L ${(amount || 0).toFixed(2)}`;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Resumen de Turno #{shift?.id}</DialogTitle>
                    <DialogDescription>
                        Vista general de las ventas y transacciones del turno actual.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Spinner />
                        </div>
                    ) : summary ? (
                        <div className="space-y-4">
                             <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-semibold">Ventas Totales</TableCell>
                                        <TableCell className="text-right font-bold">{formatCurrency(summary.totalSales)}</TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="font-semibold text-destructive">Total Descuentos</TableCell>
                                        <TableCell className="text-right font-bold text-destructive">-{formatCurrency(summary.totalDiscounts)}</TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="font-semibold">Total Órdenes</TableCell>
                                        <TableCell className="text-right">{summary.totalOrders}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            
                            <div>
                                <h3 className="font-semibold mb-2 text-center">Desglose por Medio de Pago</h3>
                                <Table>
                                    <TableBody>
                                        {summary.salesByPaymentMethod.map(pm => (
                                            <TableRow key={pm.name}>
                                                <TableCell>{pm.name}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(pm.total)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2 text-center">Resumen de Caja</h3>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Fondo de Caja Inicial</TableCell>
                                            <TableCell className="text-right">{formatCurrency(summary.startingCash)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Ventas en Efectivo</TableCell>
                                            <TableCell className="text-right">{formatCurrency(summary.cashSales)}</TableCell>
                                        </TableRow>
                                        <TableRow className="font-bold bg-muted/50">
                                            <TableCell>Efectivo Esperado en Caja</TableCell>
                                            <TableCell className="text-right">{formatCurrency(summary.expectedCash)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">No se pudo cargar el resumen.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
