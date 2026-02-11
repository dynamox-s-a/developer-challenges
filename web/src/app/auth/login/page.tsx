'use server'
import { getUserSession } from "@/utils/jwt";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const result = await getUserSession()
  if (result) redirect("/dashboard")
  return (
    <div className="flex items-center justify-center h-screen">
      <LoginForm />
    </div>
  )
}