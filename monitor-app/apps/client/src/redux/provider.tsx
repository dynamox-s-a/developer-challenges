'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import store from './store'

type Props = {
  children: ReactNode
}

export default function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>
}
