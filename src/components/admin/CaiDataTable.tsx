
'use client';

import { useState } from 'react';
import type { CaiRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';
import CaiFormDialog from './CaiFormDialog';
import { format } from 'date-fns';

interface CaiDataTableProps {
  initialRecords: CaiRecord[];
}

export default function CaiDataTable({ initialRecords }: CaiDataTableProps) {
  const [records, setRecords] = useState<CaiRecord[]>(initialRecords);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CaiRecord | null>(null);

  const handleAddNew = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: CaiRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };
  
  const onRecordSaved = (savedRecord: CaiRecord) => {
    const existingIndex = records.findIndex(r => r.id === savedRecord.id);
    if (existingIndex > -1) {
      const updatedRecords = [...records];
      updatedRecords[existingIndex] = savedRecord;
      setRecords(updatedRecords);
    } else {
      setRecords([savedRecord, ...records]);
    }
    setDialogOpen(false);
  }

  const getStatusVariant = (status: CaiRecord['status']) => {
    switch (status) {
        case 'active':
            return 'default';
        case 'pending':
            return 'secondary';
        case 'inactive':
            return 'destructive';
        default:
            return 'outline';
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>Añadir CAI</Button>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CAI</TableHead>
              <TableHead>Rango</TableHead>
              <TableHead>Fecha Límite</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
                <TableRow key={record.id}>
                    <TableCell className="font-medium truncate max-w-xs">{record.cai}</TableCell>
                    <TableCell>{record.range_start} - {record.range_end}</TableCell>
                    <TableCell>{format(new Date(record.expiration_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={getStatusVariant(record.status)}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CaiFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setDialogOpen}
        caiRecord={selectedRecord}
        onRecordSaved={onRecordSaved}
      />
    </>
  );
}
