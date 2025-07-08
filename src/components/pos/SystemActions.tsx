
'use client';

import { Button } from '@/components/ui/button';
import { FileText, Lock, LogOut, Settings, Printer, History, LogIn } from 'lucide-react';
import Link from 'next/link';

interface SystemActionsProps {
    onOpenShiftSummaryDialog: () => void;
    onEndShift: () => void;
    onLogout: () => void;
    onReprintLast: () => void;
    onViewHistory: () => void;
    onOpenAdminAuthDialog: () => void;
    shiftIsActive: boolean;
    onOpenStartShiftDialog: () => void;
}

export default function SystemActions({ 
    onOpenShiftSummaryDialog, 
    onEndShift, 
    onLogout, 
    onReprintLast, 
    onViewHistory, 
    onOpenAdminAuthDialog,
    shiftIsActive,
    onOpenStartShiftDialog
}: SystemActionsProps) {
    return (
        <div className="grid grid-cols-2 gap-2 mt-auto">
             {shiftIsActive ? (
                <>
                    <Button onClick={onOpenShiftSummaryDialog} variant="outline" className="h-14 text-xs font-bold">
                        <FileText className="mr-2 h-5 w-5" /> RESUMEN TURNO
                    </Button>
                    <Button onClick={onOpenAdminAuthDialog} variant="outline" className="h-14 text-xs font-bold">
                        <Settings className="mr-2 h-5 w-5" /> ADMIN
                    </Button>
                    <Button onClick={onReprintLast} variant="outline" className="h-14 text-xs font-bold">
                        <Printer className="mr-2 h-5 w-5" /> REIMPRIMIR ÚLTIMA
                    </Button>
                    <Button onClick={onViewHistory} variant="outline" className="h-14 text-xs font-bold">
                        <History className="mr-2 h-5 w-5" /> HISTORIAL
                    </Button>
                    <Button onClick={onEndShift} variant="outline" className="h-14 text-xs font-bold">
                        <Lock className="mr-2 h-5 w-5" /> FINALIZAR TURNO
                    </Button>
                    <Button onClick={onLogout} variant="outline" className="h-14 text-xs font-bold text-destructive/80 hover:text-destructive">
                        <LogOut className="mr-2 h-5 w-5" /> CERRAR SESIÓN
                    </Button>
                </>
             ) : (
                <>
                    <Button onClick={onOpenStartShiftDialog} variant="default" className="h-14 text-xs font-bold col-span-2">
                        <LogIn className="mr-2 h-5 w-5" /> INICIAR TURNO
                    </Button>
                     <Button onClick={onOpenAdminAuthDialog} variant="outline" className="h-14 text-xs font-bold">
                        <Settings className="mr-2 h-5 w-5" /> ADMIN
                    </Button>
                    <Button onClick={onLogout} variant="outline" className="h-14 text-xs font-bold text-destructive/80 hover:text-destructive">
                        <LogOut className="mr-2 h-5 w-5" /> CERRAR SESIÓN
                    </Button>
                </>
             )}
        </div>
    );
}
