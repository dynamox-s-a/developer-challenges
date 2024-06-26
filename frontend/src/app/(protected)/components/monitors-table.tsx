import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ButtonFilterTable from "./button-filter-table";
import { MachineDataArray, sortMachineData } from '@/lib/filter-function';
import MonitorsTableRow from './monitors-table-row';
import { ButtonAddMonitor } from './button-add-monitor';


type MonitorsTableProps = {
    validatedMachines: MachineDataArray;
};

export function MonitorsTable({ validatedMachines }: MonitorsTableProps) {
    const [currentFilter, setCurrentFilter] = useState('Mais recentes');
    const [sortedData, setSortedData] = useState<MachineDataArray>([]);

    const rowData = validatedMachines as MachineDataArray;
    useEffect(() => {
        const data = sortMachineData(validatedMachines, currentFilter);
        setSortedData(data);
    }, [currentFilter, validatedMachines]);

    return (
        <div className="flex min-h-screen w-full flex-col ">
            <div className="flex flex-col sm:gap-0 ">
                <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 lg:-mt-12 z-20">
                    <div className="flex items-center justify-end gap-2 ">
                        <ButtonFilterTable onFilterChange={setCurrentFilter} />
                        <ButtonAddMonitor />
                    </div>
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Pontos de Monitoramento e sensores</CardTitle>
                            <CardDescription>
                                Gerencie seus pontos de monitoramento e sensores.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Máquina </TableHead>
                                        <TableHead>Tipo de Máquina </TableHead>
                                        <TableHead>Ponto de Monitoramento 1</TableHead>
                                        <TableHead className='hidden md:table-cell'>Sensor 1</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Ponto de monitoramento 2
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Sensor 2
                                        </TableHead>
                                        <TableHead>
                                            <span className="sr-only">Ações</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedData?.map((machine, index) => (
                                        <MonitorsTableRow
                                            key={machine.machine_id}
                                            // @ts-ignore
                                            validatedMachine={machine}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
