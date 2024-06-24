import Link from "next/link";
import { Bell, CircleUser, Home, LineChart, Menu, Package, Package2, Search, ShoppingCart, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NextPage } from "next";
import icon from "/public/dynamox_horizontal_logo.webp"
import Image from "next/image"
import { SideNav } from "./components/side-nav";
import { MobileNav } from "./components/mobile-nav";
import Header from "./components/header";

const Admin: NextPage = () => {
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
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">Você ainda não cadastrou máquinas</h3>
              <p className="text-sm text-muted-foreground">Cadastre sua primeira máquina para adicionar sensores e pontos de monitoramento</p>
              <Button className="mt-4">Cadastrar Máquina</Button>
            </div>
          </div>
        </main>
      </div>
    </div>

  );
}

export default Admin;