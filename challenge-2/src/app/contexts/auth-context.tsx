// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'

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
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Carrega o token do localStorage
    const storedToken = localStorage.getItem('token')
    console.log(storedToken)
    if (storedToken) {
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

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

    // Se está em rota privada sem autenticação, redireciona para login
    if (isPrivateRoute && !token) {
      router.push(APP_ROUTES.public.login)
      return
    }

    // Se está em rota pública autenticado, redireciona para home
    if (isPublicRoute && token && pathname === APP_ROUTES.public.login) {
      router.push(APP_ROUTES.private.home)
    }
  }, [token, pathname, isLoading, router])

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    router.push(APP_ROUTES.public.login)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
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
