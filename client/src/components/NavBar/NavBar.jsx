import './NavBar.css'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'


export function NavBar() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  )
}