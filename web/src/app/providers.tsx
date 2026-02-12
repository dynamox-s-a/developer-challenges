'use client'

import { Provider } from 'react-redux'
import { store } from './store'
import ThemeRegistry from '@/components/auth/ThemeRegistry'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <Provider store={store}>{children}</Provider>
    </ThemeRegistry>
  )
}
