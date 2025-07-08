
import { getPaymentMethodsAction } from "@/app/actions";
import PaymentMethodsDataTable from "@/components/admin/PaymentMethodsDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default async function MediosPagoPage() {
  const initialMethods = await getPaymentMethodsAction();

  return (
    <Card>
       <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Medios de Pago</CardTitle>
        </div>
        <CardDescription>
          Añada y edite los medios de pago aceptados en su negocio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentMethodsDataTable initialMethods={initialMethods} />
      </CardContent>
    </Card>
  )
}
