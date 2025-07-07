
'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Calendar, Ban, Search, Tag, Receipt, PauseCircle } from 'lucide-react';

interface ActionPanelProps {
    onClearOrder: () => void;
}

export default function ActionPanel({ onClearOrder }: ActionPanelProps) {
  const mainActions = [
    { label: 'SUSPENDER VENTA', icon: PauseCircle },
    { label: 'ANULAR PRODUCTO', icon: Ban },
    { label: 'REIMPRIMIR RECIBO', icon: Receipt },
    { label: 'BUSCAR PRODUCTO', icon: Search },
    { label: 'DESCUENTO', icon: Tag },
  ];

  const tables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <aside className="w-[220px] bg-sidebar text-sidebar-foreground flex flex-col p-2 gap-2 border-r border-sidebar-border">
      <div className="flex flex-col gap-2">
        <Button variant="destructive" onClick={onClearOrder} className="w-full justify-center h-10 text-xs font-bold">
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
      <Button variant="ghost" className="w-full justify-center bg-orange-500 hover:bg-orange-600 text-white text-xs h-10">
        <Calendar className="mr-2 h-4 w-4" /> CALENDARIO
      </Button>
      <ScrollArea className="flex-1 my-2">
        <div className="grid grid-cols-2 gap-2 pr-2">
          {tables.map((table) => (
            <Button key={table} variant="ghost" className="aspect-square h-auto hover:bg-sidebar-accent border border-sidebar-border">
              {table}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <Button variant="ghost" className="w-full justify-start hover:bg-sidebar-accent">
        <Settings className="mr-2 h-4 w-4" /> Admin
      </Button>
    </aside>
  );
}
