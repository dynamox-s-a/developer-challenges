'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RootState } from '@/store'

export default function withAuth(
    WrappedComponent: React.ComponentType,
    requiredRole?: 'admin' | 'reader'
) {
    return function AuthComponent(props: any) {
        const router = useRouter()
        const { user, token } = useSelector((state: RootState) => state.auth)
        const [isHydrated, setIsHydrated] = useState(false)
        const [isAuthorized, setIsAuthorized] = useState(false)

        useEffect(() => {
            setIsHydrated(true)
        }, [])

        useEffect(() => {
            if (!isHydrated) return

            if (!token || !user) {
                router.replace('/login')
                setIsAuthorized(false)
                return
            }

            if (requiredRole && user.role !== requiredRole) {
                router.replace('/unauthorized')
                setIsAuthorized(false)
                return
            }

            setIsAuthorized(true)
        }, [token, user, isHydrated, router, requiredRole])

        if (!isHydrated) {
            return <div style={{ display: 'none' }} />
        }

        if (!isAuthorized) {
            return null
        }

        return <WrappedComponent {...props} />
    }
}
