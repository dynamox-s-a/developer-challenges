import { Outlet } from 'react-router'
import { Footer } from '../components/footer'

export function AppLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}
