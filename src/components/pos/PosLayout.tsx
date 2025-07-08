
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Order, Product, Table, Customer, FullInvoiceData } from '@/lib/types';
import OrderSummary from './OrderSummary';
import ProductGrid from './ProductGrid';
import { useToast } from '@/hooks/use-toast';
import ActionPanel from './ActionPanel';
import { Button } from '@/components/ui/button';
import { useSession } from '@/context/SessionContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import DiscountDialog from './DiscountDialog';
import SearchProductDialog from './SearchProductDialog';
import RemoveItemDialog from './RemoveItemDialog';
import CheckoutDialog from './CheckoutDialog';
import CustomerSelectionDialog from './CustomerSelectionDialog';
import ShiftSummaryDialog from './ShiftSummaryDialog';
import SystemActions from './SystemActions';
import InvoiceDialog from './InvoiceDialog';
import HistoryDialog from './HistoryDialog';
import RecallDialog from './RecallDialog';
import AdminAuthDialog from './AdminAuthDialog';

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
    getInvoiceDataAction,
    suspendOrderAction,
    recallOrderAction,
    getLastInvoiceForShiftAction,
    loginAction
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
  const [isShiftSummaryDialogOpen, setShiftSummaryDialogOpen] = useState(false);
  const [isInvoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setHistoryDialogOpen] = useState(false);
  const [isRecallDialogOpen, setRecallDialogOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<FullInvoiceData | null>(null);

  const [isAdminAuthDialogOpen, setAdminAuthDialogOpen] = useState(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);


  const { toast } = useToast();
  const [time, setTime] = useState('');
  const { user, shift, logout, endShift } = useSession();
  const router = useRouter();

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

  // Restore active context from sessionStorage on page load
  useEffect(() => {
    if (loadingTables) return; // Wait until tables are loaded

    const savedContextJson = sessionStorage.getItem('pos-context');
    if (savedContextJson) {
      try {
        const savedContext = JSON.parse(savedContextJson);
        if (savedContext.mode === 'table' && savedContext.tableId) {
          const table = tables.find(t => t.id === savedContext.tableId);
          if (table) {
            setActiveMode('table');
            setSelectedTable(table);
          } else {
            sessionStorage.removeItem('pos-context');
          }
        } else if (savedContext.mode === 'bar') {
          setActiveMode('bar');
        }
      } catch (e) {
        console.error("Failed to parse saved context", e);
        sessionStorage.removeItem('pos-context');
      }
    }
  }, [loadingTables, tables]);


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
        sessionStorage.removeItem('pos-context');
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
  
  const handleOrderFinalized = useCallback(async (orderId: number) => {
    setCheckoutDialogOpen(false);
    
    const result = await getInvoiceDataAction(orderId);
    if (result.success && result.data) {
        setInvoiceData(result.data);
        setInvoiceDialogOpen(true);
    } else {
        toast({ variant: 'destructive', title: 'Error de Factura', description: result.error || "No se pudo generar la factura." });
    }

    setActiveOrder(null);
    sessionStorage.removeItem('pos-context');
    if (activeMode === 'table') {
        fetchTables();
    }
  }, [fetchTables, activeMode, toast]);

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
        const newSelectedTable = tables.find(t => t.id === transferTargetTable.id) || null;
        if(newSelectedTable) {
            const updatedTable = {...newSelectedTable, status: 'occupied' as const};
            setSelectedTable(updatedTable);
            sessionStorage.setItem('pos-context', JSON.stringify({ mode: 'table', tableId: updatedTable.id }));
        }
        setTransferModalOpen(false);
        setTransferTargetTable(null);
        fetchTables();
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
      if (activeMode === 'table' && selectedTable?.id === table?.id) {
          setSelectedTable(null);
          sessionStorage.removeItem('pos-context');
      } else {
          setActiveMode('table');
          setSelectedTable(table);
          if (table) {
            sessionStorage.setItem('pos-context', JSON.stringify({ mode: 'table', tableId: table.id }));
          }
      }
  }

  const handleBarOrderClick = () => {
      setActiveMode('bar');
      setSelectedTable(null);
      sessionStorage.setItem('pos-context', JSON.stringify({ mode: 'bar', tableId: null }));
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

   const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleEndShift = async () => {
    await endShift();
    await logout();
    router.push('/login');
  };

  const handleReprintLast = async () => {
    if (!shift) {
        toast({ variant: 'destructive', title: 'Error', description: 'No hay un turno activo.' });
        return;
    }
    const result = await getLastInvoiceForShiftAction(shift.id);
    if (result.success && result.data) {
        setInvoiceData(result.data);
        setInvoiceDialogOpen(true);
    } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se encontró la última factura.' });
    }
  };

  const handleViewHistory = () => {
      setHistoryDialogOpen(true);
  };

  const handleViewOrderDetails = async (orderId: number) => {
      const result = await getInvoiceDataAction(orderId);
      if (result.success && result.data) {
          setInvoiceData(result.data);
          setHistoryDialogOpen(false); 
          setInvoiceDialogOpen(true); 
      } else {
          toast({ variant: 'destructive', title: 'Error', description: result.error || 'No se pudo cargar la factura.' });
      }
  };

  const handleSuspendOrder = async () => {
    if (!activeOrder) return;
    setLoadingOrder(true);
    const result = await suspendOrderAction(activeOrder.id);
    if (result.success) {
      toast({ title: 'Venta Suspendida', description: 'La orden ha sido guardada para llamarla más tarde.' });
      setActiveOrder(null);
      setSelectedTable(null);
      sessionStorage.removeItem('pos-context');
      if (activeMode === 'table') fetchTables();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoadingOrder(false);
  };

  const handleRecallOrder = async (orderId: number) => {
    if (activeOrder) {
      toast({ variant: 'destructive', title: 'Acción inválida', description: 'Por favor, finalice o suspenda la orden actual primero.' });
      return;
    }
    setLoadingOrder(true);
    const result = await recallOrderAction(orderId);
    if (result.success && result.data) {
      setActiveOrder(result.data);
      setActiveMode('bar');
      sessionStorage.setItem('pos-context', JSON.stringify({ mode: 'bar', tableId: null }));
      setRecallDialogOpen(false);
      toast({ title: 'Venta Llamada', description: "La orden ha sido restaurada en modo 'Para Llevar'." });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setLoadingOrder(false);
  };

  const handleAdminAuth = async (password: string) => {
    if (!user) return;
    setAdminAuthLoading(true);
    const result = await loginAction({ username: user.username, password });
    if (result.success && result.user?.role === 'admin') {
      setAdminAuthDialogOpen(false);
      router.push('/admin');
    } else {
      toast({ variant: 'destructive', title: 'Acceso Denegado', description: 'La contraseña es incorrecta o no tiene permisos de administrador.' });
    }
    setAdminAuthLoading(false);
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
            onSuspendOrder={handleSuspendOrder}
            onOpenRecallDialog={() => setRecallDialogOpen(true)}
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
            <SystemActions 
                onOpenShiftSummaryDialog={() => setShiftSummaryDialogOpen(true)}
                onEndShift={handleEndShift}
                onLogout={handleLogout}
                onReprintLast={handleReprintLast}
                onViewHistory={handleViewHistory}
                onOpenAdminAuthDialog={() => setAdminAuthDialogOpen(true)}
            />
        </aside>
      </div>
      <footer className="h-8 px-4 bg-blue-700 text-white flex justify-between items-center text-xs z-10">
            <span>Usuario: {user?.username || 'N/A'}</span>
            <span>Turno: #{shift?.id || 'N/A'}</span>
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
        <ShiftSummaryDialog
            isOpen={isShiftSummaryDialogOpen}
            onOpenChange={setShiftSummaryDialogOpen}
            shift={shift}
        />
        <InvoiceDialog 
            isOpen={isInvoiceDialogOpen}
            onOpenChange={setInvoiceDialogOpen}
            invoiceData={invoiceData}
        />
        <HistoryDialog
            isOpen={isHistoryDialogOpen}
            onOpenChange={setHistoryDialogOpen}
            shift={shift}
            onViewDetails={handleViewOrderDetails}
        />
        <RecallDialog
            isOpen={isRecallDialogOpen}
            onOpenChange={setRecallDialogOpen}
            shift={shift}
            onRecallOrder={handleRecallOrder}
        />
        <AdminAuthDialog
            isOpen={isAdminAuthDialogOpen}
            onOpenChange={setAdminAuthDialogOpen}
            onConfirm={handleAdminAuth}
            loading={adminAuthLoading}
        />
    </div>
  );
}
