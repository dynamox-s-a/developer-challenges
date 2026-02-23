'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import EventsPage from '@/app/(private)/events/page'

export default function AdminEventsPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <EventsPage />
    </AuthGuard>
  )
}