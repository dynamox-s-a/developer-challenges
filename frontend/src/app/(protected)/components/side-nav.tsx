import Link from 'next/link';
import { Home, CogIcon, SmartphoneNfc, Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export function SideNav() {

    return (

        <div>
            <nav className="grid items-start mt-4 px-2 text-sm font-medium lg:px-4">
                <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Home className="h-4 w-4" /> Dashboard
                </Link>
                <Link href="machines" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <CogIcon className="h-4 w-4" /> Máquinas
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
                </Link>
                <Link href="sensors" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                    <SmartphoneNfc className="h-4 w-4" /> Sensores
                </Link>
                <Link href="monitoring-points" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Shield className="h-4 w-4" /> Pontos de monitoramento
                </Link>
            </nav>
        </div>
    )
}