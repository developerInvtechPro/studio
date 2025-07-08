'use client';

import type { FullInvoiceData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '../ui/separator';
import { numberToWords } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Printer } from 'lucide-react';

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  invoiceData: FullInvoiceData | null;
}

export default function InvoiceDialog({ isOpen, onOpenChange, invoiceData }: InvoiceDialogProps) {
    if (!invoiceData) return null;

    const { order, companyInfo, caiRecord, customer } = invoiceData;

    const handlePrint = () => {
        window.print();
    };
    
    const taxed15 = order.items.reduce((acc, item) => {
        if (item.product.taxRate === 15) {
            const itemSubtotal = item.price_at_time * item.quantity;
            const itemDiscount = itemSubtotal * (order.discount_percentage / 100);
            return acc + (itemSubtotal - itemDiscount);
        }
        return acc;
    }, 0);
    
    const taxExempt = order.items.reduce((acc, item) => {
        if (item.product.taxRate === 0) {
            const itemSubtotal = item.price_at_time * item.quantity;
            const itemDiscount = itemSubtotal * (order.discount_percentage / 100);
            return acc + (itemSubtotal - itemDiscount);
        }
        return acc;
    }, 0);

    const isv15Amount = taxed15 * 0.15;


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 print:shadow-none print:border-none print:!max-w-full print:p-0">
                <style>
                    {`
                        @media print {
                            body {
                                background: #fff;
                            }
                            .print-container {
                                font-family: 'Courier New', Courier, monospace;
                                color: #000;
                                width: 80mm;
                                margin: 0 auto;
                                padding: 5mm;
                            }
                            .print-header, .print-footer {
                                text-align: center;
                            }
                            .print-table {
                                width: 100%;
                                border-collapse: collapse;
                            }
                            .print-table th, .print-table td {
                                text-align: left;
                                padding: 1px 2px;
                            }
                            .print-table .text-right {
                                text-align: right;
                            }
                            .print-totals {
                                margin-top: 5mm;
                            }
                            .print-totals div {
                                display: flex;
                                justify-content: space-between;
                            }
                        }
                    `}
                </style>
                <div id="invoice-content" className="p-6 print-container">
                    <div className="print-header text-center space-y-1 text-xs">
                        <p className="font-bold text-lg">{companyInfo.name}</p>
                        <p>{companyInfo.address}</p>
                        <p>RTN: {companyInfo.rtn}</p>
                        <p>TEL: {companyInfo.phone}</p>
                        <p>{companyInfo.email}</p>
                    </div>

                    <Separator className="my-3 border-dashed" />
                    
                    <div className="text-xs space-y-1">
                        <p><strong>FECHA:</strong> {format(new Date(order.created_at), "dd/MM/yyyy HH:mm:ss")}</p>
                        <p><strong>FACTURA N°:</strong> {order.invoice_number}</p>
                        <p><strong>CAI:</strong> {caiRecord.cai}</p>
                    </div>

                     <Separator className="my-3 border-dashed" />

                    <div className="text-xs space-y-1">
                        <p><strong>CLIENTE:</strong> {customer?.name || order.customer_name || 'Consumidor Final'}</p>
                        <p><strong>RTN:</strong> {customer?.rtn || 'N/A'}</p>
                    </div>

                    <Separator className="my-3 border-dashed" />

                    <table className="w-full text-xs print-table">
                        <thead>
                            <tr>
                                <th>CANT</th>
                                <th>DESCRIPCIÓN</th>
                                <th className="text-right">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.quantity}</td>
                                    <td>{item.product.name}</td>
                                    <td className="text-right">L {(item.quantity * item.price_at_time).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <Separator className="my-3 border-dashed" />

                    <div className="text-xs space-y-1 print-totals">
                        <div>
                            <span>SUBTOTAL:</span>
                            <span>L {order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount_amount > 0 && (
                            <div className="text-destructive">
                                <span>DESCUENTO ({order.discount_percentage}%):</span>
                                <span>-L {order.discount_amount.toFixed(2)}</span>
                            </div>
                        )}
                        <Separator className="my-1 border-dashed" />
                         <div>
                            <span>IMPORTE EXONERADO:</span>
                            <span>L 0.00</span>
                        </div>
                         <div>
                            <span>IMPORTE EXENTO:</span>
                            <span>L {taxExempt.toFixed(2)}</span>
                        </div>
                         <div>
                            <span>IMPORTE GRAVADO 15%:</span>
                            <span>L {taxed15.toFixed(2)}</span>
                        </div>
                         <div>
                            <span>IMPORTE GRAVADO 18%:</span>
                            <span>L 0.00</span>
                        </div>
                         <Separator className="my-1 border-dashed" />
                        <div>
                            <span>I.S.V. 15%:</span>
                            <span>L {isv15Amount.toFixed(2)}</span>
                        </div>
                        <div>
                            <span>I.S.V. 18%:</span>
                            <span>L 0.00</span>
                        </div>
                        <Separator className="my-1 border-dashed" />
                        <div className="font-bold text-sm">
                            <span>TOTAL A PAGAR:</span>
                            <span>L {order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="text-xs mt-3">
                        <p>{numberToWords(order.total_amount)}</p>
                    </div>

                    <Separator className="my-3 border-dashed" />

                    <div className="text-center text-xs space-y-1 print-footer">
                        <p>Rango Autorizado: {caiRecord.range_start} al {caiRecord.range_end}</p>
                        <p>Fecha Límite de Emisión: {format(new Date(caiRecord.expiration_date), 'dd/MM/yyyy')}</p>
                        <p className="font-bold mt-2">LA FACTURA ES BENEFICIO DE TODOS, ¡EXÍJALA!</p>
                        <p className="mt-2">Original: Cliente / Duplicado: Obligado Tributario Emisor</p>
                    </div>
                </div>
                <DialogFooter className="p-4 pt-0 print:hidden">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                    <Button type="button" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
