
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function InventarioPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Warehouse className="h-6 w-6 text-primary" />
            <CardTitle>Reporte de Inventario</CardTitle>
        </div>
        <CardDescription>
          Consulte las existencias actuales de sus productos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Esta función estará disponible próximamente.</p>
      </CardContent>
    </Card>
  );
}
