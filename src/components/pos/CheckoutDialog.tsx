
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Order, PaymentMethod, Payment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getPaymentMethodsAction, processPaymentAction } from '@/app/actions';
import Spinner from '../ui/spinner';
import { Trash2 } from 'lucide-react';

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order | null;
  onOrderFinalized: (orderId: number) => void;
}

export default function CheckoutDialog({ isOpen, onOpenChange, order, onOrderFinalized }: CheckoutDialogProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentAmount, setCurrentAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPaymentMethods() {
      const methods = await getPaymentMethodsAction();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedMethodId(String(methods[0].id));
      }
    }
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);
  
  // Reset state when dialog opens or order changes
  useEffect(() => {
    if (isOpen && order) {
      setPayments([]);
      setCurrentAmount(order.total_amount.toFixed(2));
      if (paymentMethods.length > 0) {
          setSelectedMethodId(String(paymentMethods[0].id));
      }
    } else if (!isOpen) {
        // Clear state on close
        setPayments([]);
        setCurrentAmount('');
        setSelectedMethodId('');
    }
  }, [isOpen, order, paymentMethods]);

  const totalPaid = useMemo(() => payments.reduce((acc, p) => acc + p.amount, 0), [payments]);
  const remainingAmount = useMemo(() => order ? order.total_amount - totalPaid : 0, [order, totalPaid]);
  const changeAmount = useMemo(() => totalPaid > (order?.total_amount || 0) ? totalPaid - (order?.total_amount || 0) : 0, [totalPaid, order]);

  const handleAddPayment = () => {
    const amount = parseFloat(currentAmount);
    if (!amount || amount <= 0 || !selectedMethodId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Por favor ingrese un monto válido y seleccione un método de pago.' });
      return;
    }

    setPayments([...payments, { paymentMethodId: parseInt(selectedMethodId, 10), amount }]);
    
    // Reset for next payment, suggesting the remaining balance
    const newRemaining = remainingAmount - amount;
    setCurrentAmount(newRemaining > 0 ? newRemaining.toFixed(2) : '');
  };

  const handleRemovePayment = (indexToRemove: number) => {
    const newPayments = payments.filter((_, index) => index !== indexToRemove);
    setPayments(newPayments);
  };

  const handleConfirmPayment = async () => {
    if (!order) return;
    if (remainingAmount > 0.001) { // Use a small epsilon for float comparison
        toast({ variant: 'destructive', title: 'Pago Incompleto', description: `Aún falta por pagar L ${remainingAmount.toFixed(2)}.` });
        return;
    }
    
    setLoading(true);
    const result = await processPaymentAction(order.id, payments);
    if (result.success) {
        toast({ title: '¡Venta completada!', description: `El cambio es de L ${changeAmount.toFixed(2)}.` });
        onOrderFinalized(order.id);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoading(false);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Procesar Pago</DialogTitle>
          <DialogDescription>Orden #{order.id}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center bg-primary text-primary-foreground p-4 rounded-lg">
            <span className="text-lg font-bold">TOTAL A PAGAR</span>
            <span className="text-2xl font-bold">L {order.total_amount.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Agregar Pago</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Monto"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="flex-grow"
              />
              <Select value={selectedMethodId} onValueChange={setSelectedMethodId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={method.id} value={String(method.id)}>{method.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddPayment}>Agregar</Button>
            </div>
          </div>
          
          {payments.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Pagos Registrados</h3>
              <Table>
                <TableBody>
                  {payments.map((p, index) => (
                    <TableRow key={index}>
                      <TableCell>{paymentMethods.find(pm => pm.id === p.paymentMethodId)?.name}</TableCell>
                      <TableCell className="text-right">L {p.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemovePayment(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="space-y-2 pt-4 border-t">
             <div className="flex justify-between items-center text-md">
                <span className="font-semibold">Total Pagado:</span>
                <span className="font-bold">L {totalPaid.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between items-center text-md ${remainingAmount > 0 ? 'text-destructive' : 'text-primary'}`}>
                <span className="font-semibold">{remainingAmount > 0 ? 'Faltante:' : 'Cambio:'}</span>
                <span className="font-bold">L {Math.abs(remainingAmount).toFixed(2)}</span>
            </div>
          </div>

        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleConfirmPayment} disabled={loading || remainingAmount > 0.001}>
            {loading ? <Spinner size="sm" /> : 'Confirmar Pago'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
