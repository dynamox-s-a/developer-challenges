'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: Array<'admin' | 'reader'>
}

export function AuthGuard({
  children,
  allowedRoles
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { isAuthenticated, isLoading, user } = useAppSelector(
    state => state.auth
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${pathname}`)
      return
    }

    if (
      !isLoading &&
      isAuthenticated &&
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace('/events')
    }
  }, [
    isAuthenticated,
    isLoading,
    allowedRoles,
    user,
    pathname,
    router
  ])

  if (isLoading) return <span>Loading...</span>

  if (!isAuthenticated) return null

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return null
  }

  return <>{children}</>
}