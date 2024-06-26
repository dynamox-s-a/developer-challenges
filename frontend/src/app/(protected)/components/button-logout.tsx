'use client'


import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
 
export default function ButtonLogout() {
  return <Button onClick={() => signOut()}>Sair</Button>
}