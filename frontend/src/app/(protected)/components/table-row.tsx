import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

import { TableRow, TableCell } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { RowProps } from '@/models/rowProps'

export default function Row({ machineData, sensorData }: RowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">
                {machineData.machine_name}
            </TableCell>
            <TableCell>
                {machineData.machine_type}
            </TableCell>
            <TableCell>
                {sensorData.length > 0 ? (
                    sensorData.map((sensor, index) => (
                        <div key={index}>
                            <p>{sensor.sensor_type}</p>
                        </div>
                    ))
                ) : (
                    <p>--</p>
                )}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {sensorData.length > 0 && sensorData.some(sensor => sensor.monitoring_point_id) ? (
                    sensorData.map((sensor, index) => (
                        <div key={index}>
                            <p>{sensor.monitoring_point_id || "--"}</p>
                        </div>
                    ))
                ) : (
                    <p>--</p>
                )}
            </TableCell>
            <TableCell className="hidden md:table-cell">
            {format(new Date(machineData.createdAt), 'dd/MM/yyyy \'às\' HH:mm')}
            </TableCell>
            {/* // Future implementation */}
            {/* <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell> */}
        </TableRow>
    );
}