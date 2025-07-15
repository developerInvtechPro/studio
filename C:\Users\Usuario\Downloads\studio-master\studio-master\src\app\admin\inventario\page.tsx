
import { getAdminProductsAction, getCategoriesAction } from "@/app/actions";
import InventoryDataTable from "@/components/admin/InventoryDataTable";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default async function InventarioPage() {
  const initialProducts = await getAdminProductsAction();
  const categories = await getCategoriesAction();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Warehouse className="h-6 w-6 text-primary" />
            <CardTitle>Reporte de Inventario</CardTitle>
        </div>
        <CardDescription>
          Consulte las existencias actuales de sus productos y el valor total de su inventario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InventoryDataTable initialProducts={initialProducts} categories={categories} />
      </CardContent>
    </Card>
  );
}
