import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

export default function ButtonFilterTable({ onFilterChange }: { onFilterChange: (filter: string) => void }) {
    const handleFilterChange = (filter: string) => {
        onFilterChange(filter);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 ">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Ordenação
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ordene por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange('Tipo de máquina')}>
                    Tipo de máquina
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange('Tipo de sensor')}>
                    Tipo de sensor
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange('Ponto de monitoramento')}>
                    Ponto de monitoramento
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem onClick={() => handleFilterChange('Nomes das Máquinas (A-Z)')}>
                    Nomes das Máquinas (A-Z)
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
