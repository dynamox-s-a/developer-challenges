import Link from 'next/link';
import { Home, 
    CogIcon, 
    SmartphoneNfc, 
    Shield 
} from 'lucide-react';
import Image from "next/image"

import { Badge } from '@/components/ui/badge';
import icon from "/public/dynamox_horizontal_logo.webp"

export function MobileNav() {

    return (
        <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Image src={icon} alt="Logo" width={150} height={150} />
            </Link>
            <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <Home className="h-5 w-5" /> Dashboard
            </Link>
            <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                <CogIcon className="h-5 w-5" /> Máquinas
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
            </Link>
            <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <SmartphoneNfc className="h-5 w-5" /> Sensores
            </Link>
            <Link href="#" className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                <Shield className="h-5 w-5" /> Pontos de monitoramento
            </Link>
        </nav>
    )
}