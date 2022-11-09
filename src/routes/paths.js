import { lazy } from 'react'

export const Login = lazy(() =>
  import('src/pages/Login').then(module => ({
    default: module.Login,
  })),
)

export const Products = lazy(() =>
  import('src/pages/Products').then(module => ({
    default: module.Products,
  })),
)
