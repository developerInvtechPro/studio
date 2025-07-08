
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order, Product, Table, Customer, PaymentMethod } from '@/lib/types';
import OrderSummary from './OrderSummary';
import ProductGrid from './ProductGrid';
import { useToast } from '@/hooks/use-toast';
import ActionPanel from './ActionPanel';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useSession } from '@/context/SessionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import DiscountDialog from './DiscountDialog';
import SearchProductDialog from './SearchProductDialog';
import RemoveItemDialog from './RemoveItemDialog';
import CheckoutDialog from './CheckoutDialog';
import CustomerSelectionDialog from './CustomerSelectionDialog';

import { 
    getTablesAction,
    getOpenOrderForTable,
    addItemToOrder,
    updateOrderItemQuantity,
    removeItemFromOrder,
    cancelOrder,
    updateTableStatusAction,
    transferOrderAction,
    applyDiscountAction,
    getOpenBarOrder,
    addItemToBarOrder,
    assignCustomerToOrderAction,
    processPaymentAction
} from '@/app/actions';

export default function PosLayout() {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [activeMode, setActiveMode] = useState<'table' | 'bar'>('table');
  
  const [isReserveModalOpen, setReserveModalOpen] = useState(false);
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTargetTable, setTransferTargetTable] = useState<Table | null>(null);
  
  const [isDiscountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [isSearchProductDialogOpen, setSearchProductDialogOpen] = useState(false);
  const [isRemoveItemDialogOpen, setRemoveItemDialogOpen] = useState(false);
  const [isCheckoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [isCustomerDialogOpen, setCustomerDialogOpen] = useState(false);

  const { toast } = useToast();
  const [time, setTime] = useState('');
  const { user, shift } = useSession();

  const fetchTables = useCallback(async () => {
    try {
        setLoadingTables(true);
        const tablesData = await getTablesAction();
        setTables(tablesData);
    } catch (error) {
        console.error("Failed to fetch tables", error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las mesas.' });
    } finally {
        setLoadingTables(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleString('es-HN'));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const fetchOrderForTable = useCallback(async (tableId: number) => {
    setLoadingOrder(true);
    try {
        const order = await getOpenOrderForTable(tableId);
        setActiveOrder(order);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la orden para esta mesa.' });
    } finally {
        setLoadingOrder(false);
    }
  }, [toast]);

  const fetchBarOrder = useCallback(async () => {
      if (!shift) return;
      setLoadingOrder(true);
      try {
          const order = await getOpenBarOrder(shift.id);
          setActiveOrder(order);
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la orden para llevar.' });
      } finally {
          setLoadingOrder(false);
      }
  }, [shift, toast]);

  useEffect(() => {
    if (activeMode === 'table') {
        if (selectedTable) {
            fetchOrderForTable(selectedTable.id);
        } else {
            setActiveOrder(null);
        }
    } else if (activeMode === 'bar') {
        fetchBarOrder();
    }
  }, [selectedTable, activeMode, fetchOrderForTable, fetchBarOrder]);

  const addProductToOrder = async (product: Product) => {
    if (!shift) {
        toast({ variant: 'destructive', title: 'Acción inválida', description: 'No hay un turno activo.' });
        return;
    }

    setLoadingOrder(true);
    let result;

    if (activeMode === 'table') {
        if (!selectedTable) {
            toast({ variant: 'destructive', title: 'Acción inválida', description: 'Por favor, seleccione una mesa antes de agregar productos.' });
            setLoadingOrder(false);
            return;
        }
        if (selectedTable.status === 'reserved') {
            toast({ variant: 'destructive', title: 'Acción inválida', description: 'No se puede agregar productos a una mesa reservada.' });
            setLoadingOrder(false);
            return;
        }
        result = await addItemToOrder(selectedTable.id, shift.id, product.id);
    } else { // activeMode === 'bar'
        result = await addItemToBarOrder(shift.id, product.id);
    }
    
    if (result.success && result.data) {
        setActiveOrder(result.data);
        if (activeMode === 'table' && selectedTable?.status === 'available') {
            fetchTables();
        }
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo agregar el producto a la orden.' });
    }
    setLoadingOrder(false);
  };

  const handleUpdateQuantity = async (orderItemId: number, newQuantity: number) => {
    setLoadingOrder(true);
    const result = await updateOrderItemQuantity(orderItemId, newQuantity);
    if (result.success && result.data) {
        setActiveOrder(result.data);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo actualizar la cantidad.' });
    }
    setLoadingOrder(false);
  };
  
  const handleRemoveItem = async (orderItemId: number) => {
    setLoadingOrder(true);
    const result = await removeItemFromOrder(orderItemId);
    if (result.success && result.data) {
        setActiveOrder(result.data);
        toast({title: "Producto removido", description: "El producto ha sido removido de la orden."});
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo remover el producto.' });
    }
    setLoadingOrder(false);
  };

  const handleClearOrder = useCallback(async () => {
    if (activeOrder) {
      setLoadingOrder(true);
      try {
        await cancelOrder(activeOrder.id);
        setActiveOrder(null);
        if (activeMode === 'table') {
            fetchTables();
        }
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cancelar la orden.' });
      } finally {
        setLoadingOrder(false);
      }
    }
  }, [activeOrder, fetchTables, toast, activeMode]);
  
  const handleOrderFinalized = useCallback(() => {
    setActiveOrder(null);
    setCheckoutDialogOpen(false);
    if (activeMode === 'table') {
        fetchTables();
    }
  }, [fetchTables, activeMode]);

  const handleReserveTable = async (table: Table) => {
    if (table.status === 'occupied') {
        toast({ variant: 'destructive', title: 'Error', description: 'No se puede reservar una mesa ocupada.' });
        return;
    }
    const newStatus = table.status === 'reserved' ? 'available' : 'reserved';
    const result = await updateTableStatusAction(table.id, newStatus);
    if (result.success) {
        toast({ title: 'Éxito', description: `Mesa ${table.name} ha sido ${newStatus === 'reserved' ? 'reservada' : 'liberada'}.` });
        fetchTables();
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleTransferConfirm = async () => {
    if (!selectedTable || !activeOrder || !transferTargetTable) return;
    
    setLoadingOrder(true);
    const result = await transferOrderAction(activeOrder.id, selectedTable.id, transferTargetTable.id);
    setLoadingOrder(false);

    if (result.success) {
        toast({ title: 'Éxito', description: `La orden ha sido trasladada a ${transferTargetTable.name}.` });
        fetchTables();
        const newSelectedTable = tables.find(t => t.id === transferTargetTable.id) || null;
        if(newSelectedTable) {
            const updatedTable = {...newSelectedTable, status: 'occupied' as const};
            setSelectedTable(updatedTable);
        }
        setTransferModalOpen(false);
        setTransferTargetTable(null);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const handleApplyDiscount = async (percentage: number) => {
    if (!activeOrder) return;
    setLoadingOrder(true);
    const result = await applyDiscountAction(activeOrder.id, percentage);
    if (result.success && result.data) {
        setActiveOrder(result.data);
        setDiscountDialogOpen(false);
        toast({ title: 'Descuento aplicado', description: `Se aplicó un ${percentage}% de descuento.` });
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo aplicar el descuento.' });
    }
    setLoadingOrder(false);
  };
  
  const handleTableSelection = (table: Table | null) => {
      setActiveMode('table');
      if (selectedTable?.id === table?.id) {
          setSelectedTable(null);
      } else {
          setSelectedTable(table);
      }
  }

  const handleBarOrderClick = () => {
      setActiveMode('bar');
      setSelectedTable(null);
  }

  const handleAssignCustomer = async (customer: Customer) => {
    if (!activeOrder) {
        toast({ variant: 'destructive', title: 'Error', description: 'No hay una orden activa para asignarle un cliente.' });
        return;
    }
    setLoadingOrder(true);
    const result = await assignCustomerToOrderAction(activeOrder.id, customer.id);
    if (result.success && result.data) {
        setActiveOrder(result.data);
        toast({ title: 'Cliente Asignado', description: `${customer.name} ha sido asignado a la orden.` });
        setCustomerDialogOpen(false);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo asignar el cliente.' });
    }
    setLoadingOrder(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans text-sm">
      <div className="flex flex-1 overflow-hidden">
        <ActionPanel 
            onClearOrder={handleClearOrder}
            tables={tables}
            loading={loadingTables}
            selectedTable={selectedTable}
            onSelectTable={handleTableSelection}
            onOpenReserveDialog={() => setReserveModalOpen(true)}
            onOpenTransferDialog={() => setTransferModalOpen(true)}
            hasOpenOrder={!!activeOrder && activeOrder.items.length > 0}
            onOpenDiscountDialog={() => setDiscountDialogOpen(true)}
            onOpenSearchProductDialog={() => setSearchProductDialogOpen(true)}
            onOpenRemoveItemDialog={() => setRemoveItemDialogOpen(true)}
            onBarOrderClick={handleBarOrderClick}
            isBarOrderActive={activeMode === 'bar'}
        />
        
        <main className="flex-1 flex flex-col p-2 md:p-4 gap-4 bg-muted/30">
            <div className="flex gap-2 flex-wrap">
                <Button>CONSUMIDOR FINAL</Button>
                <Button variant="outline" onClick={() => setCustomerDialogOpen(true)} disabled={!activeOrder}>CLIENTE RTN</Button>
                <Button variant="outline">CLIENTE CRÉDITO</Button>
                <Button variant="outline">CLIENTE LEAL</Button>
            </div>
            <OrderSummary 
                order={activeOrder}
                isLoading={loadingOrder}
                onUpdateQuantity={handleUpdateQuantity} 
                onRemoveItem={handleRemoveItem} 
                shift={shift}
                selectedTable={selectedTable}
                activeMode={activeMode}
                onFinalizeOrderClick={() => setCheckoutDialogOpen(true)}
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
            <span>Usuario: {user?.username || 'N/A'}</span>
            <span>{time}</span>
      </footer>

      {/* Reservation Dialog */}
        <Dialog open={isReserveModalOpen} onOpenChange={setReserveModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reservar Mesas</DialogTitle>
                    <DialogDescription>
                        Haga clic en una mesa para reservarla o liberarla. Las mesas ocupadas no se pueden reservar.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    {tables.map((table) => (
                        <Button
                            key={table.id}
                            variant={table.status === 'reserved' ? 'default' : 'outline'}
                            className={table.status === 'reserved' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                            onClick={() => handleReserveTable(table)}
                            disabled={table.status === 'occupied'}
                        >
                            {table.name}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
        
        {/* Transfer Dialog */}
        <Dialog open={isTransferModalOpen} onOpenChange={(isOpen) => { if(!isOpen) { setTransferTargetTable(null); } setTransferModalOpen(isOpen); }}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Trasladar Orden de Mesa</DialogTitle>
                    <DialogDescription>
                        Trasladando orden de <strong>{selectedTable?.name}</strong>. Seleccione la mesa de destino.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    {tables.filter(t => t.status === 'available').map((table) => (
                        <Button
                            key={table.id}
                            variant={transferTargetTable?.id === table.id ? 'secondary' : 'outline'}
                            onClick={() => setTransferTargetTable(table)}
                        >
                            {table.name}
                        </Button>
                    ))}
                </div>
                 <DialogFooter>
                    <Button variant="ghost" onClick={() => setTransferModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleTransferConfirm} disabled={!transferTargetTable}>
                        Confirmar Traslado
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Action Dialogs */}
        <DiscountDialog 
            isOpen={isDiscountDialogOpen} 
            onOpenChange={setDiscountDialogOpen}
            onSubmit={handleApplyDiscount}
            currentDiscount={activeOrder?.discount_percentage || 0}
        />
        <SearchProductDialog
            isOpen={isSearchProductDialogOpen}
            onOpenChange={setSearchProductDialogOpen}
            onProductSelect={(product) => {
                addProductToOrder(product);
                setSearchProductDialogOpen(false);
            }}
        />
        <RemoveItemDialog
            isOpen={isRemoveItemDialogOpen}
            onOpenChange={setRemoveItemDialogOpen}
            order={activeOrder}
            onRemoveItem={(itemId) => {
                handleRemoveItem(itemId);
                setRemoveItemDialogOpen(false);
            }}
        />
        <CheckoutDialog
            isOpen={isCheckoutDialogOpen}
            onOpenChange={setCheckoutDialogOpen}
            order={activeOrder}
            onOrderFinalized={handleOrderFinalized}
        />
        <CustomerSelectionDialog
            isOpen={isCustomerDialogOpen}
            onOpenChange={setCustomerDialogOpen}
            onCustomerSelect={handleAssignCustomer}
        />
    </div>
  );
}
