import { useAppDispatch } from '@/store/store'
import { logout } from '@/store/thunk/auth-thunk'
import { Button } from '@mui/material'
import { ReactNode } from 'react'

interface PrivateLayoutProps {
  children: ReactNode
}

export function PrivateLayout({ children }: PrivateLayoutProps) {
  const dispatch = useAppDispatch()

  function logoutApp() {
    dispatch(logout())
  }

  return (
    <>
      PrivateLayout
      <Button onClick={logoutApp}>Logout</Button>
      {children}
    </>
  )
}
