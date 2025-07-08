
import { getSuppliersAction } from "@/app/actions";
import SuppliersDataTable from "@/components/admin/SuppliersDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default async function ProveedoresPage() {
  const initialSuppliers = await getSuppliersAction();

  return (
    <Card>
       <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Proveedores</CardTitle>
        </div>
        <CardDescription>
          Añada y edite la información de sus proveedores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SuppliersDataTable initialSuppliers={initialSuppliers} />
      </CardContent>
    </Card>
  )
}
