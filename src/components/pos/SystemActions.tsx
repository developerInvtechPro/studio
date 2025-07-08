
'use client';

import { Button } from '@/components/ui/button';
import { FileText, Lock, LogOut, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemActionsProps {
    onOpenShiftSummaryDialog: () => void;
    onEndShift: () => void;
    onLogout: () => void;
}

export default function SystemActions({ onOpenShiftSummaryDialog, onEndShift, onLogout }: SystemActionsProps) {
    const { toast } = useToast();

    const handleNotImplemented = () => {
        toast({
            title: 'Función no implementada',
            description: 'Esta función estará disponible próximamente.',
        });
    };

    return (
        <div className="grid grid-cols-2 gap-2 mt-auto">
             <Button onClick={onOpenShiftSummaryDialog} variant="outline" className="h-14 text-xs font-bold">
                <FileText className="mr-2 h-5 w-5" /> RESUMEN TURNO
            </Button>
            <Button onClick={handleNotImplemented} variant="outline" className="h-14 text-xs font-bold">
                <Settings className="mr-2 h-5 w-5" /> ADMIN
            </Button>
            <Button onClick={onEndShift} variant="outline" className="h-14 text-xs font-bold">
                <Lock className="mr-2 h-5 w-5" /> FINALIZAR TURNO
            </Button>
            <Button onClick={onLogout} variant="outline" className="h-14 text-xs font-bold text-destructive/80 hover:text-destructive">
                <LogOut className="mr-2 h-5 w-5" /> CERRAR SESIÓN
            </Button>
        </div>
    );
}
