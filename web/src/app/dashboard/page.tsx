import { getUserSession } from "@/utils/jwt"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getUserSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <h1>Hello! Dashboard protected route HERE!!</h1>
  )
}