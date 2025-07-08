
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <CardTitle>BCPOS</CardTitle>
        </div>
        <CardDescription>Bienvenido al Panel de Administración.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Seleccione una opción del menú de la izquierda para comenzar a administrar su sistema.</p>
      </CardContent>
    </Card>
  );
}
