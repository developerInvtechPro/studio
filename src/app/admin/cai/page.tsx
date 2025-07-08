
import { getCaiRecordsAction } from "@/app/actions";
import CaiDataTable from "@/components/admin/CaiDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileKey } from "lucide-react";

export default async function CaiPage() {
  const initialRecords = await getCaiRecordsAction();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <FileKey className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de CAI</CardTitle>
        </div>
        <CardDescription>
          Administre los Códigos de Autorización de Impresión para la facturación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CaiDataTable initialRecords={initialRecords} />
      </CardContent>
    </Card>
  );
}
