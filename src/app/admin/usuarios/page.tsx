
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsuariosPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de Usuarios</CardTitle>
        </div>
        <CardDescription>
          Administre los cajeros y administradores del sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Esta función estará disponible próximamente.</p>
      </CardContent>
    </Card>
  );
}
