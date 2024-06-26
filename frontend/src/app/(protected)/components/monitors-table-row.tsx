import { TableRow, TableCell } from '@/components/ui/table';
import { MachineData } from '@/models/machineModel';
import ButtonMoreOptions from './button-action-monitor-table';
import { ButtonAddSensor } from './button-add-sensor';

type MonitorsData = {
    monitoring_point_name: string;
    sensors: {
        sensor_type: string;
        sensor_id: number;
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
    console.log("Machine row", machine.monitors[0]?.sensors[0]?.sensor_type);

    return (

        <TableRow>
            <TableCell className="font-medium">
                {machine.machine_name}
            </TableCell>
            <TableCell className="font-medium">
                {machine.machine_type}
            </TableCell>
            <TableCell className='flex justify-start items-center'>
                {machine.monitors[0]?.monitoring_point_name || '--'}
            </TableCell>
            <TableCell className='hidden md:table-cell'>
                <div className='flex justify-start items-center'>

                    {machine.monitors[0]?.sensors[0]?.sensor_type ? (
                        <>
                            {machine.monitors[0]?.sensors[0]?.sensor_type}
                        </>
                    ) : (
                        // @ts-ignore
                        <ButtonAddSensor monitor_id={machine.monitors[0]?.monitoring_point_id} machine_id={machine.machine_id} machine_type={machine.machine_type} />
                    )}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className='flex justify-start items-center'>
                    {machine.monitors[1]?.monitoring_point_name || '--'}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className='flex justify-start items-center'>
                    {machine.monitors[1]?.sensors[0]?.sensor_type ? (
                        <>
                            {machine.monitors[1]?.sensors[0]?.sensor_type}
                        </>
                    ) : (
                        // @ts-ignore
                        <ButtonAddSensor monitor_id={machine.monitors[1]?.monitoring_point_id} machine_id={machine.machine_id} machine_type={machine.machine_type} />
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}
