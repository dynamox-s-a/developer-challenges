'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { loadUserFromStorage } from '@/store/thunk/auth-thunk'

const APP_ROUTES = {
  admin: '/admin', // Adicionei explicitamente a rota de admin
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

    const isPublicRoute = Object.values(APP_ROUTES.public).includes(pathname)
    const isAdminRoute = pathname.startsWith(APP_ROUTES.admin)
    const isPrivateRoute = Object.values(APP_ROUTES.private).some((route) => {
      if (route.includes('/:')) {
        const baseRoute = route.split('/:')[0]
        return pathname.startsWith(baseRoute)
      }
      return pathname === route
    })

    // Se tentando acessar rota de admin sem ser admin
    if (isAdminRoute && (!isAuthenticated || user?.role !== 'admin')) {
      router.push(APP_ROUTES.private.home)
      return
    }

    // Se tentando acessar rota privada sem estar autenticado
    if (isPrivateRoute && !isAuthenticated) {
      router.push(APP_ROUTES.public.login)
      return
    }

    // Se autenticado e tentando acessar rota pública (como login)
    if (isPublicRoute && isAuthenticated) {
      router.push(APP_ROUTES.private.home)
      return
    }
  }, [isAuthenticated, pathname, isLoading, router, user?.role, isInitialLoad])

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
