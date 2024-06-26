import React from 'react';
import { MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function ButtonMoreOptions({ elementId, elementType }: { elementId: number, elementType: string }) {

    function handleAction(actionType: string) {
        if (actionType === 'edit') {
            // Chamar função de edição
        } else if (actionType === 'delete') {
            // Chamar função de exclusão
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreVerticalIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Opções</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleAction('edit')}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('delete')}>Deletar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}