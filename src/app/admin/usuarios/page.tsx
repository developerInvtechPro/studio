
import { getUsersAction } from "@/app/actions";
import UsersDataTable from "@/components/admin/UsersDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function UsuariosPage() {
  const initialUsers = await getUsersAction();

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
        <UsersDataTable initialUsers={initialUsers} />
      </CardContent>
    </Card>
  );
}
