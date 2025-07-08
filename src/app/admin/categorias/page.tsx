
import { getCategoriesAction } from "@/app/actions";
import CategoriesDataTable from "@/components/admin/CategoriesDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

export default async function CategoriasPage() {
  const initialCategories = await getCategoriesAction();

  return (
    <Card>
       <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Categorías</CardTitle>
        </div>
        <CardDescription>
          Añada y edite las categorías para organizar sus productos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategoriesDataTable initialCategories={initialCategories} />
      </CardContent>
    </Card>
  )
}
