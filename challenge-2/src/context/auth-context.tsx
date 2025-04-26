'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { loadUserFromStorage } from '@/store/thunk/auth-thunk'

export const APP_ROUTES = {
  admin: {
    admin: '/admin',
    dashboard: '/admin/dashboard',
  },
  private: {
    home: '/',
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
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true)

  useEffect(() => {
    const loadAuth = async () => {
      await dispatch(loadUserFromStorage())
      setIsInitialLoad(false)
    }
    loadAuth()
  }, [dispatch])

  useEffect(() => {
    // Espera até que o carregamento inicial esteja completo
    if (isInitialLoad || isLoading) return

    // const isPublicRoute = Object.values(APP_ROUTES.public).includes(pathname)

    const isLoginRoute = pathname === APP_ROUTES.public.login

    const isAdminRoute = pathname.startsWith(APP_ROUTES.admin.admin)

    const isPrivateRoute = Object.values(APP_ROUTES.private).some((route) => {
      if (route.includes('/:')) {
        const baseRoute = route.split('/:')[0]
        return pathname.startsWith(baseRoute)
      }
      return pathname === route
    })

    // Está na rota /admin - mas não está autenticado e não é adm
    if (isAdminRoute && (!isAuthenticated || user?.role !== 'admin')) {
      router.push(APP_ROUTES.private.home)
      return
    }

    // Está na rota /privada - mas não está autenticado
    if (isPrivateRoute && !isAuthenticated) {
      router.push(APP_ROUTES.public.login)
      return
    }

    // Esta na rota /publica - mas esta autenticado
    if (isLoginRoute && isAuthenticated) {
      if (user?.role === 'admin') {
        router.push(APP_ROUTES.admin.dashboard)
      } else {
        router.push(APP_ROUTES.private.home)
      }
      return
    }

    setIsCheckingPermissions(false)
  }, [isAuthenticated, pathname, isLoading, router, user?.role, isInitialLoad])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading }}>
      {isCheckingPermissions ? <div>Carregando...</div> : children}
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
