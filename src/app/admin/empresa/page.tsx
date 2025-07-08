
import { getCompanyInfoAction } from "@/app/actions";
import CompanyInfoForm from "@/components/admin/CompanyInfoForm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";

export default async function EmpresaPage() {
  const companyInfo = await getCompanyInfoAction();

  if (!companyInfo) {
    return <div>Error al cargar la información de la empresa.</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Building className="h-6 w-6 text-primary" />
            <CardTitle>Información de la Empresa</CardTitle>
        </div>
        <CardDescription>
          Estos datos se utilizarán en las facturas y otros documentos oficiales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CompanyInfoForm initialData={companyInfo} />
      </CardContent>
    </Card>
  );
}
