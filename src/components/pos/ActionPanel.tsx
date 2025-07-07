
'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Calendar, Ban, Search, Tag, Receipt, PauseCircle, LogOut, Lock, Move } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import type { Table } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ActionPanelProps {
    onClearOrder: () => void;
    tables: Table[];
    loading: boolean;
    selectedTable: Table | null;
    onSelectTable: (table: Table | null) => void;
    onOpenReserveDialog: () => void;
    onOpenTransferDialog: () => void;
    hasOpenOrder: boolean;
}

export default function ActionPanel({ 
    onClearOrder, 
    tables, 
    loading, 
    selectedTable, 
    onSelectTable,
    onOpenReserveDialog,
    onOpenTransferDialog,
    hasOpenOrder,
}: ActionPanelProps) {
  const { logout, endShift } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleEndShift = async () => {
    await endShift();
    router.push('/login');
  };
  
  const handleClearOrder = () => {
    if (!selectedTable) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No hay una mesa seleccionada para cancelar.',
        });
        return;
    }
    onClearOrder();
    toast({
        title: 'Orden Cancelada',
        description: 'La orden pendiente ha sido removida.',
        variant: 'destructive',
    });
  }

  const mainActions = [
    { label: 'SUSPENDER VENTA', icon: PauseCircle },
    { label: 'ANULAR PRODUCTO', icon: Ban },
    { label: 'REIMPRIMIR RECIBO', icon: Receipt },
    { label: 'BUSCAR PRODUCTO', icon: Search },
    { label: 'DESCUENTO', icon: Tag },
  ];

  const handleTableSelection = (table: Table) => {
    // Allow deselecting a table
    if (selectedTable?.id === table.id) {
        onSelectTable(null);
    } else {
        onSelectTable(table);
    }
  }

  return (
    <aside className="w-[220px] bg-sidebar text-sidebar-foreground flex flex-col p-2 gap-2 border-r border-sidebar-border">
      <div className="flex flex-col gap-2">
        <Button variant="destructive" onClick={handleClearOrder} className="w-full justify-center h-10 text-xs font-bold">
            CANCELAR VENTA
        </Button>
        {mainActions.map((action) => (
          <Button key={action.label} variant="ghost" className="w-full justify-center h-10 text-xs hover:bg-sidebar-accent">
            {action.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs h-10">NUEVO DELIVERY</Button>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-10">NUEVO PICKUP</Button>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={onOpenTransferDialog} disabled={!hasOpenOrder} variant="ghost" className="w-full justify-center bg-purple-500 hover:bg-purple-600 text-white text-xs h-10">
            <Move className="mr-2 h-4 w-4" /> TRASLADAR MESA
        </Button>
        <Button onClick={onOpenReserveDialog} variant="ghost" className="w-full justify-center bg-orange-500 hover:bg-orange-600 text-white text-xs h-10">
            <Calendar className="mr-2 h-4 w-4" /> CALENDARIO
        </Button>
      </div>
      <ScrollArea className="flex-1 my-2">
        <div className="grid grid-cols-2 gap-2 pr-2">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square h-auto w-full" />
            ))
          ) : (
            tables.map((table) => (
              <Button 
                key={table.id} 
                variant={selectedTable?.id === table.id ? 'secondary' : 'ghost'} 
                className={cn("aspect-square h-auto hover:bg-sidebar-accent border border-sidebar-border", {
                    "opacity-60 ring-2 ring-destructive": table.status === 'occupied' && selectedTable?.id !== table.id,
                    "opacity-60 ring-2 ring-yellow-400": table.status === 'reserved' && selectedTable?.id !== table.id,
                    "bg-secondary text-secondary-foreground": selectedTable?.id === table.id,
                })}
                onClick={() => handleTableSelection(table)}
              >
                {table.name}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
       <div className="mt-auto flex flex-col gap-2">
        <Button onClick={handleEndShift} variant="ghost" className="w-full justify-start hover:bg-sidebar-accent">
          <Lock className="mr-2 h-4 w-4" /> Finalizar Turno
        </Button>
         <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-destructive/80 hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
        </Button>
        <Button variant="ghost" className="w-full justify-start hover:bg-sidebar-accent">
          <Settings className="mr-2 h-4 w-4" /> Admin
        </Button>
       </div>
    </aside>
  );
}
