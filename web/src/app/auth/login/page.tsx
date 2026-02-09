'use server'
import LoginComponent from "@/components/auth/login";
import { getUserSession } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const result = await getUserSession()
  if (result) redirect("/dashboard")
  return (
    <div className="flex items-center justify-center h-screen">
      <LoginComponent />
    </div>
  )
}