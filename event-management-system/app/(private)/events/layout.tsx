'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAppSelector(
    state => state.auth
  )

  useEffect(() => {
    if (isLoading) return

    if (isAuthenticated && user?.role === 'admin') {
      router.replace('/admin/events')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading || user?.role === 'admin') {
    return null
  }

  return (
    <AuthGuard allowedRoles={['reader']}>
      {children}
    </AuthGuard>
  )
}