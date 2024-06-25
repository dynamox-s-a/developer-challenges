'use client'

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'

export default function ButtonLogout() {

    const router = useRouter()


    async function logout() {
        await signOut({
          redirect: false
        })
    
    router.replace('/')
      }

      return <Button onClick={logout} >Sair</Button>
}