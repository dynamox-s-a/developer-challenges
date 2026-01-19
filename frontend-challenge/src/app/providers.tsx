'use client'

import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { store } from '@/store'
import { useAuthInit } from '@/hooks/useAuthInit'
import { theme } from './theme'
import { useEffect, useState } from 'react'

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false)

    useAuthInit()

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) {
        return <>{children}</>
    }

    return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AuthInitializer>{children}</AuthInitializer>
            </ThemeProvider>
        </Provider>
    )
}