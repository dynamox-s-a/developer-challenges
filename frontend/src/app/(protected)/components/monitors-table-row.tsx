import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MachineData } from '@/models/machineModel';

type MonitorsData = {
    monitoring_point_name: string;
    sensors: {
        sensor_type: string;
    }[];
};

type MonitorsTableRowProps = {
    validatedMachine: MachineData & {
        monitors: MonitorsData[];
    };
};

export default function MonitorsTableRow({ validatedMachine }: MonitorsTableRowProps) {
    const machine = validatedMachine;
    console.log("Machine row", machine);

    return (
        <TableRow>
            <TableCell className="font-medium">
                {machine.machine_name}
            </TableCell>
            <TableCell>
                {machine.monitors[0]?.monitoring_point_name || '--'}
            </TableCell>
            <TableCell>
                {machine.monitors[0]?.sensors[0]?.sensor_type || '--'}
            </TableCell>
            <TableCell className="hidden md:table-cell">
                {machine.monitors[1]?.monitoring_point_name || '--'}
            </TableCell>
            <TableCell>
                {machine.monitors[1]?.sensors[1]?.sensor_type || '--'}
            </TableCell>
        </TableRow>
    );
}
