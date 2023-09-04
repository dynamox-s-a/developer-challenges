export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/machines',
    '/dashboard/machines/create',
    '/dashboard/machines/edit'
  ]
}
