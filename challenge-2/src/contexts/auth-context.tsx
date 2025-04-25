'use client'

import { createContext, useContext, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { loadUserFromStorage } from '@/store/thunk/auth-thunk'

const APP_ROUTES = {
  private: {
    home: '/',
    adminDashboard: '/admin-dashboard',
    events: '/events/:id',
  },
  public: {
    login: '/login',
  },
}

interface AuthContextType {
  token: string | null
  user: { id: number; email: string; role: string } | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const { token, user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  useEffect(() => {
    if (isLoading) return

    const isPublicRoute = Object.values(APP_ROUTES.public).includes(pathname)
    const isPrivateRoute = Object.values(APP_ROUTES.private).some((route) => {
      if (route.includes('/:')) {
        const baseRoute = route.split('/:')[0]
        return pathname.startsWith(baseRoute)
      }
      return pathname === route
    })

    if (isPrivateRoute && !isAuthenticated) {
      router.push(APP_ROUTES.public.login)
      return
    }

    if (isPublicRoute && isAuthenticated && pathname === APP_ROUTES.public.login) {
      router.push(APP_ROUTES.private.home)
    }
  }, [isAuthenticated, pathname, isLoading, router])

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
