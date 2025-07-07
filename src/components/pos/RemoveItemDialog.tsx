
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Order } from '@/lib/types';
import { Trash2 } from 'lucide-react';

interface RemoveItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order | null;
  onRemoveItem: (orderItemId: number) => void;
}

export default function RemoveItemDialog({
  isOpen,
  onOpenChange,
  order,
  onRemoveItem,
}: RemoveItemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anular Producto</DialogTitle>
          <DialogDescription>
            Seleccione un producto de la orden para anularlo (removerlo).
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cant.</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No hay productos en la orden.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
