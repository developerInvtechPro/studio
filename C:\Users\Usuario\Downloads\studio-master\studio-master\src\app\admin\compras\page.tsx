
import { getPurchaseInvoicesAction, getSuppliersAction } from "@/app/actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import PurchaseInvoicesList from "@/components/admin/PurchaseInvoicesList";

export default async function ComprasPage() {
  const initialInvoices = await getPurchaseInvoicesAction();
  const suppliers = await getSuppliersAction();

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
        <PurchaseInvoicesList initialInvoices={initialInvoices} suppliers={suppliers} />
      </CardContent>
    </Card>
  );
}
