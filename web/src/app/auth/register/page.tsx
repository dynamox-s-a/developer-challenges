'use server'
import RegisterForm from "@/components/auth/RegisterForm";
import { getUserSession } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function RegisterPage() {  
  const result = await getUserSession()
  if (result) redirect("/dashboard")
  return (
    <div className="flex items-center justify-center h-screen">
      <RegisterForm />
    </div>
  )
}