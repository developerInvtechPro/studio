
import { getAdminProductsAction, getCategoriesAction } from "@/app/actions";
import ProductsDataTable from "@/components/admin/ProductsDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default async function ProductosPage() {
  const initialProducts = await getAdminProductsAction();
  const categories = await getCategoriesAction();

  return (
    <Card>
       <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Package className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Productos</CardTitle>
        </div>
        <CardDescription>
          Añada, edite o desactive los productos de su inventario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductsDataTable initialProducts={initialProducts} categories={categories} />
      </CardContent>
    </Card>
  )
}
