
import { getCustomersAction } from "@/app/actions";
import CustomersDataTable from "@/components/admin/CustomersDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "lucide-react";

export default async function ClientesPage() {
  const initialCustomers = await getCustomersAction();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Contact className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Clientes</CardTitle>
        </div>
        <CardDescription>
          Añada, edite o busque la información de sus clientes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomersDataTable initialCustomers={initialCustomers} />
      </CardContent>
    </Card>
  )
}
