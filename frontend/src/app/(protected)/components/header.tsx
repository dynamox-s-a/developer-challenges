'use client'
import { Menu } from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import ProfileMenu from "./profile-menu";
import ButtonLogout from './button-logout';

export default function Header() {

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <MobileNav />

                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">

            </div>
{/*             <ProfileMenu />
 */}            <ButtonLogout />
        </header>
    )
}