
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function ProveedoresPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Proveedores</CardTitle>
        </div>
        <CardDescription>
          Administre la información de contacto y los datos de sus proveedores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Esta función estará disponible próximamente.</p>
      </CardContent>
    </Card>
  );
}
