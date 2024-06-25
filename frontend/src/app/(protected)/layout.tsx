
import Image from "next/image"

import icon from "/public/dynamox_horizontal_logo.webp"
import { SideNav } from "./components/side-nav";
import Header from "./components/header";



export default function ProtectedLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
   

    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex  h-14 items-center border-b px-4  lg:h-[60px] lg:px-6">
            <Image src={icon} alt="Logo" width={120} height={120} className="pt-2" />
          </div>
          <div className="flex-1">
            <SideNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
    
    )
  }