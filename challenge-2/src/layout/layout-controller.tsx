'use client'
import { APP_ROUTES } from '@/context/auth-context'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { PrivateLayout } from './private-layout'
import { PublicLayout } from './public-layout'
import { useAppSelector } from '@/store/store'
import { AdminLayout } from './admin-layout'

interface LayoutControllerProps {
  children: ReactNode
}

export function LayoutController({ children }: LayoutControllerProps) {
  const pathname = usePathname()
  const { user } = useAppSelector((state) => state.auth)

  const isPrivateRoute = Object.values(APP_ROUTES.private).some((route) => {
    if (route.includes('/:')) {
      const baseRoute = route.split('/:')[0]
      return pathname.startsWith(baseRoute)
    }
    return pathname === route
  })

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdmin = user?.role === 'admin'

  if (isAdmin && isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>
  }

  if (isPrivateRoute) {
    return <PrivateLayout>{children}</PrivateLayout>
  }

  return <PublicLayout>{children}</PublicLayout>
}
