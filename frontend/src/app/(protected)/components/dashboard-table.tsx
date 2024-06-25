import Image from "next/image"

import {
    MoreHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import ButtonFilterTable from "./button-filter-table"
import { ButtonAddMachine } from "./button-add-machine"
import Row from "./table-row"

export function DashboardTable() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-col sm:gap-0 lg:-mt-14 ">
                <main className="grid flex-1 items-start gap-4  sm:py-0 md:gap-8">
                    <div className="flex items-center">
                        <div className="ml-auto flex items-center gap-2">
                            <ButtonFilterTable />
                            <ButtonAddMachine />
                        </div>
                    </div>
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Máquinas, Sensores e Pontos de Monitoramento</CardTitle>
                            <CardDescription>
                                Acompanhe o status de suas máquinas, sensores e pontos de monitoramento.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Tipo de Máquina</TableHead>
                                        <TableHead>Sensores</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Pontos de monitoramento
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Criado em
                                        </TableHead>
                                        <TableHead>
                                            <span className="sr-only">Ações</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Row />
                                    
                                </TableBody>
                            </Table>
                        </CardContent>

                    </Card>


                </main>
            </div>
        </div>
    )
}
