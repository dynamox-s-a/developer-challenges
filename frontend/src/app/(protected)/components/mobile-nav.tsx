'use client'
import Link from 'next/link';
import {
    Home,
    CogIcon,
    SmartphoneNfc,
    Shield
} from 'lucide-react';
import Image from "next/image"
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import icon from "/public/dynamox_horizontal_logo.webp"

export function MobileNav() {

    const IsActive = (path: string) => {
        const pathActive = usePathname();
        return pathActive === path;
    }
    
    return (
        <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Image src={icon} alt="Logo" width={150} height={150} />
            </Link>
            <Link href="/machines" className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${IsActive('/machines') ? 'text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <CogIcon className="h-5 w-5" /> Máquinas
            </Link>
            <Link href="/monitoring-points" className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${IsActive('/monitoring-points') ? 'text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                <Shield className="h-5 w-5" /> Pontos de monitoramento
            </Link>
        </nav>
    )
}
