
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function ComprasPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <CardTitle>Órdenes de Compra</CardTitle>
        </div>
        <CardDescription>
          Registre los ingresos de mercadería y actualice su inventario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Esta función estará disponible próximamente.</p>
      </CardContent>
    </Card>
  );
}
