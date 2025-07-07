
'use client';

import type { OrderItem, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Trash2, Wallet, Clock, Tag, XCircle } from 'lucide-react';
import SmartUpsell from './SmartUpsell';
import BudgetTracker from './BudgetTracker';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearOrder: () => void;
}

export default function OrderSummary({ orderItems, onUpdateQuantity, onRemoveItem, onClearOrder }: OrderSummaryProps) {
  const subtotal = orderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col xl:flex-row gap-4 h-full">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Current Order</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 relative">
          <ScrollArea className="h-full">
            <div className="px-6">
              {orderItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map(item => (
                      <TableRow key={item.id} className="transition-all">
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => onRemoveItem(item.product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">Select products to start an order</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        {orderItems.length > 0 && (
          <CardFooter className="flex-col !p-6 !pt-2 border-t mt-auto">
            <div className="w-full space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span className="font-headline">Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4 w-full">
              <Button variant="outline" size="lg"><Tag className="mr-2 h-4 w-4" /> Discount</Button>
              <Button variant="outline" size="lg"><Clock className="mr-2 h-4 w-4" /> Hold</Button>
              <Button variant="destructive" size="lg" onClick={onClearOrder}><XCircle className="mr-2 h-4 w-4" /> Cancel</Button>
              <Button size="lg" className="bg-secondary hover:bg-accent text-secondary-foreground font-bold">
                <Wallet className="mr-2 h-4 w-4" /> Pay
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      <div className="flex flex-col gap-4 w-full xl:w-[320px] shrink-0">
        <SmartUpsell orderItems={orderItems} />
        <BudgetTracker />
      </div>
    </div>
  );
}
