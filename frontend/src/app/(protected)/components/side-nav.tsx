'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { Home, CogIcon, SmartphoneNfc, Shield } from 'lucide-react';


export function SideNav() {

    const IsActive = (path: string) => {
        const pathActive = usePathname();
        return pathActive === path;
    }
        
    return (
        <div>
            <nav className="grid items-start mt-4 px-2 text-sm font-medium lg:px-4">
                
                <Link href="/machines" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${IsActive('/machines') ? 'bg-muted text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}>
                    <CogIcon className="h-4 w-4" /> Máquinas
                </Link>
                <Link href="/monitoring-points" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${IsActive('/monitoring-points') ? 'bg-muted text-primary' : 'text-muted-foreground'} transition-all hover:text-primary`}>
                    <Shield className="h-4 w-4" /> Pontos de monitoramento
                </Link>
            </nav>
            
        </div>
    );
}