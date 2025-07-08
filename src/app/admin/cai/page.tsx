
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileKey } from "lucide-react";

export default function CaiPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <FileKey className="h-6 w-6 text-primary" />
            <CardTitle>Gestión de CAI</CardTitle>
        </div>
        <CardDescription>
          Administre los Códigos de Autorización de Impresión para la facturación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Esta función estará disponible próximamente.</p>
      </CardContent>
    </Card>
  );
}
