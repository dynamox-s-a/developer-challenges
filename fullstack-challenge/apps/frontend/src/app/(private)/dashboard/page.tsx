import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logoutButton";


export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <div>Olá, {session?.user?.name}</div>
      <div>Dashboard</div>
      <LogoutButton />
    </div>
  )

}