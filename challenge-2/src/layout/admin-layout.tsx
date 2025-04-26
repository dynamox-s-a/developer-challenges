import { useAppDispatch } from '@/store/store'
import { logout } from '@/store/thunk/auth-thunk'
import { Button } from '@mui/material'
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const dispatch = useAppDispatch()

  function logoutApp() {
    dispatch(logout())
  }

  return (
    <>
      Layout de Administrador
      <Button onClick={logoutApp}>Logout</Button>
      {children}
    </>
  )
}
