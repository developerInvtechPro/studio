
'use client';

import { useState, useEffect } from 'react';
import type { OrderItem, Product } from '@/lib/types';
import OrderSummary from './OrderSummary';
import ProductGrid from './ProductGrid';
import { useToast } from '@/hooks/use-toast';
import ActionPanel from './ActionPanel';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function PosLayout() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleString('es-HN'));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const addProductToOrder = (product: Product) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { id: Date.now(), product, quantity: 1 }];
    });
  };

  const updateItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(productId);
    } else {
      setOrderItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const removeItemFromOrder = (productId: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const clearOrder = () => {
    setOrderItems([]);
    toast({
      title: 'Orden Cancelada',
      description: 'Los productos han sido removidos de la orden.',
      variant: 'destructive',
    })
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans text-sm">
      <div className="flex flex-1 overflow-hidden">
        <ActionPanel onClearOrder={clearOrder} />
        
        <main className="flex-1 flex flex-col p-2 md:p-4 gap-4 bg-muted/30">
            <div className="flex gap-2 flex-wrap">
                <Button>CONSUMIDOR FINAL</Button>
                <Button variant="outline">CLIENTE RTN</Button>
                <Button variant="outline">CLIENTE CRÉDITO</Button>
                <Button variant="outline">CLIENTE LEAL</Button>
            </div>
            <OrderSummary 
                orderItems={orderItems} 
                onUpdateQuantity={updateItemQuantity} 
                onRemoveItem={removeItemFromOrder} 
            />
        </main>

        <aside className="w-[45%] max-w-[600px] p-2 md:p-4 flex flex-col gap-4 border-l bg-card">
            <ProductGrid onProductSelect={addProductToOrder} />
             <Button variant="outline" className="mt-auto">
                <Home className="mr-2 h-4 w-4"/>
                HOME
            </Button>
        </aside>
      </div>
      <footer className="h-8 px-4 bg-blue-700 text-white flex justify-between items-center text-xs z-10">
            <span>Usuario: Cajero General</span>
            <span>{time}</span>
      </footer>
    </div>
  );
}
