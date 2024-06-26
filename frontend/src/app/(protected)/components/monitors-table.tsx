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
import Row from "./table-row";
import { RowProps } from "@/models/rowProps";
import { MachineData } from "@/models/machineModel";
import { Key } from "react";
import { MachineDataArray, sortMachineData } from '@/lib/filter-function';

export function MonitorsTable({ machineData, sensorData }: RowProps) {
    const [currentFilter, setCurrentFilter] = useState('Mais recentes');
    const [sortedData, setSortedData] = useState<MachineData[]>([]);

    useEffect(() => {
       const data = sortMachineData(machineData as MachineDataArray, currentFilter);
        setSortedData(data);
    }, [currentFilter, machineData]); 

    return (
        <div className="flex min-h-screen w-full flex-col">
            <div className="flex flex-col sm:gap-0 lg:-mt-14">
                <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                    <div className="flex items-center justify-end gap-2">
                        <ButtonFilterTable onFilterChange={setCurrentFilter} />
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
                                        <TableHead>Ponto de Monitoramento 1</TableHead>
                                        <TableHead>Sensor 1</TableHead>
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
                                    {sortedData.map((machine: MachineData, index: Key | null | undefined) => (
                                        <Row
                                            key={index}
                                            machineData={machine}
                                            sensorData={sensorData.filter(sensor => sensor.machine_id === machine.machine_id)}
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