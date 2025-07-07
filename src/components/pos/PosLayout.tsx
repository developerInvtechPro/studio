
'use client';

import { useState } from 'react';
import type { OrderItem, Product } from '@/lib/types';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, Table, BarChart3, Settings, LogOut, Coffee, ChevronDown } from 'lucide-react';
import OrderSummary from './OrderSummary';
import ProductGrid from './ProductGrid';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PosLayout() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();

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
    toast({
      title: `${product.name} added`,
      description: `Price: $${product.price.toFixed(2)}`,
    })
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
      title: 'Order Cleared',
      description: 'The current order has been cancelled.',
    })
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="items-center justify-center p-4">
          <Coffee className="h-8 w-8 text-secondary" />
          <h1 className="text-xl font-headline font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Café Central
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Tables">
                <Table />
                <span>Tables</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Reports">
                <BarChart3 />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="justify-start w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center p-2 h-auto">
                 <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User" data-ai-hint="employee portrait" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="text-left group-data-[collapsible=icon]:hidden">
                    <p className="font-semibold text-sm text-sidebar-foreground">Jane Doe</p>
                    <p className="text-xs text-sidebar-foreground/70">Cashier</p>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto group-data-[collapsible=icon]:hidden"/>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Shift Summary</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 h-screen flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold">Point of Sale</h2>
            <SidebarTrigger className="md:hidden" />
          </header>
          
          <div className="flex-grow h-0 flex flex-col gap-4">
            <div className="h-2/5">
              <OrderSummary 
                orderItems={orderItems} 
                onUpdateQuantity={updateItemQuantity} 
                onRemoveItem={removeItemFromOrder} 
                onClearOrder={clearOrder}
              />
            </div>
            <div className="h-3/5">
              <ProductGrid onProductSelect={addProductToOrder} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
