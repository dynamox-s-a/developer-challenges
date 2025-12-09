---
name: jwt-auth-patterns
description: Implement JWT authentication and role-based authorization in Next.js applications. Use when creating login/logout flows, protecting routes, implementing role-based access control (RBAC), storing tokens, creating auth context, or building HOCs/middleware for route protection.
---

# JWT Authentication & Authorization Patterns

## Overview

This skill provides patterns for implementing fake JWT authentication with role-based access control in Next.js applications, specifically for the Event Management System challenge.

## Authentication Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User submits credentials                                │
│         ↓                                                   │
│  2. API validates against db.json                           │
│         ↓                                                   │
│  3. Generate fake JWT token (base64 encoded)                │
│         ↓                                                   │
│  4. Store token in localStorage                             │
│         ↓                                                   │
│  5. Include token in API request headers                    │
│         ↓                                                   │
│  6. Redirect based on user role                             │
│     - Admin → /dashboard                                    │
│     - Reader → /events                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Token Structure

### Fake JWT Token Format

```typescript
// lib/auth/token.ts
interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin' | 'reader';
  exp: number; // Expiration timestamp
}

// Generate fake JWT (base64 encoded)
export function generateToken(payload: Omit<TokenPayload, 'exp'>): string {
  const tokenData: TokenPayload = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  return btoa(JSON.stringify(tokenData));
}

// Decode token
export function decodeToken(token: string): TokenPayload | null {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}

// Check if token is valid
export function isTokenValid(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return false;
  return payload.exp > Date.now();
}

// Get user from token
export function getUserFromToken(token: string): Omit<TokenPayload, 'exp'> | null {
  const payload = decodeToken(token);
  if (!payload || payload.exp < Date.now()) return null;
  const { exp, ...user } = payload;
  return user;
}
```

## Auth Context Implementation

### Auth Provider

```tsx
// contexts/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken, isTokenValid, TokenPayload } from '@/lib/auth/token';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'reader';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isReader: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken && isTokenValid(storedToken)) {
        const payload = decodeToken(storedToken);
        if (payload) {
          setToken(storedToken);
          setUser({
            id: payload.userId,
            email: payload.email,
            role: payload.role,
          });
        }
      } else {
        // Clear invalid token
        localStorage.removeItem('token');
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const { token: newToken, user: userData } = await response.json();

      // Store token
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);

      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/events');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isReader: user?.role === 'reader',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Route Protection

### Protected Route HOC

```tsx
// components/auth/withAuth.tsx
'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface WithAuthOptions {
  requiredRole?: 'admin' | 'reader';
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { requiredRole, redirectTo = '/login' } = options;

  return function WithAuthComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push(redirectTo);
        } else if (requiredRole && user?.role !== requiredRole) {
          // Redirect to appropriate page based on actual role
          if (user?.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/events');
          }
        }
      }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Usage examples:
// export default withAuth(DashboardPage); // Any authenticated user
// export default withAuth(AdminPage, { requiredRole: 'admin' }); // Admin only
// export default withAuth(EventsPage, { requiredRole: 'reader' }); // Reader only
```

### Protected Route Wrapper Component

```tsx
// components/auth/ProtectedRoute.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'reader';
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackPath);
    }
  }, [isAuthenticated, isLoading, router, fallbackPath]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole) {
      if (user?.role !== requiredRole) {
        // Redirect based on actual role
        router.push(user?.role === 'admin' ? '/dashboard' : '/events');
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
```

## Middleware-Based Protection

### Next.js Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/events', '/admin'];

// Routes that require specific roles
const adminRoutes = ['/dashboard', '/admin'];
const readerRoutes = ['/events'];

// Public routes (redirect if authenticated)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Parse token to check role (simplified - in real app, verify JWT)
  if (token) {
    try {
      const payload = JSON.parse(atob(token));
      const isExpired = payload.exp < Date.now();

      if (isExpired) {
        // Clear expired token and redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
      }

      // Redirect authenticated users away from auth pages
      if (isAuthRoute) {
        const redirectUrl = payload.role === 'admin' ? '/dashboard' : '/events';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      // Check role-based access
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/events', request.url));
      }
    } catch {
      // Invalid token - clear and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
```

## Login Page Implementation

### Login Form

```tsx
// app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Sign In
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Event Management System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Demo Credentials:</strong>
              <br />
              Admin: admin@events.com / admin123
              <br />
              Reader: reader@events.com / reader123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
```

## API Request with Token

### Authenticated API Client

```tsx
// lib/api/client.ts
import { getToken, removeToken } from '@/lib/auth/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function authenticatedFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (requireAuth) {
    const token = getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 - unauthorized
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  // Handle 403 - forbidden
  if (response.status === 403) {
    throw new Error('Access denied. Insufficient permissions.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  return response.json();
}
```

### Token Storage Utilities

```tsx
// lib/auth/storage.ts
const TOKEN_KEY = 'token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

// For middleware/server-side: use cookies
export function getTokenFromCookies(cookies: string): string | null {
  const match = cookies.match(new RegExp(`${TOKEN_KEY}=([^;]+)`));
  return match ? match[1] : null;
}
```

## Role-Based UI Components

### Conditional Rendering by Role

```tsx
// components/auth/RoleGate.tsx
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: Array<'admin' | 'reader'>;
  fallback?: ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Usage:
// <RoleGate allowedRoles={['admin']}>
//   <Button>Delete Event</Button>
// </RoleGate>
```

### Admin-Only Component

```tsx
// components/auth/AdminOnly.tsx
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <>{fallback}</>;
}
```

## Layout with Auth

### Protected Layout

```tsx
// app/(protected)/layout.tsx
'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
```

### Admin Layout

```tsx
// app/(protected)/(admin)/layout.tsx
'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}
```

## Best Practices

1. **Never store sensitive data in localStorage** - For demo only, use httpOnly cookies in production
2. **Validate tokens on both client and server** - Middleware + context checks
3. **Handle token expiration gracefully** - Auto-logout and redirect
4. **Use role-based UI rendering** - Hide unauthorized actions
5. **Protect API routes** - Include token in all authenticated requests
6. **Clear tokens on logout** - Remove from all storage locations
7. **Implement refresh token pattern** - For production apps
8. **Use TypeScript** - Type all auth-related interfaces
