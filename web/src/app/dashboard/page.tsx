import DataTable from "@/components/dashboard/visualization/DataTable";
import { getUserSession } from "@/utils/jwt"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getUserSession()

  if (!session) {
    redirect('/auth/login')
  }

return (
    <div className="flex items-center justify-center">
      <DataTable />
    </div>
  );
}