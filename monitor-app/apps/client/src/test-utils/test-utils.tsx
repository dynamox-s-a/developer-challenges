import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

import { AppRouterContextProviderMock } from './app-router-context-provider-mock'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const push = jest.fn()
  return <AppRouterContextProviderMock router={{ push }}>{children}</AppRouterContextProviderMock>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
