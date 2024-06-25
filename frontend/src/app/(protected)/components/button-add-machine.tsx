import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


export function ButtonAddMachine() {
    return (
        <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicione uma máquina
            </span>
        </Button>
    );
}