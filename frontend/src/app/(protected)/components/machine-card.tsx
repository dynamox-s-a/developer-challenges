import { format } from 'date-fns'

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MachineData } from "@/models/machineModel"
import { ButtonEditMachine } from "./button-edit-machine"
import { Button } from '@/components/ui/button'
import ButtonRemoveMachine from './button-remove-machine'


export default function MachineCard({
    machine_id,
    machine_type,
    machine_name,
    createdAt,
}: MachineData
) {
    return (
        <Card className="flex flex-col w-44">
            <div className='flex w-full p-0 m-0 justify-end'>
                <ButtonEditMachine machine_id={machine_id} />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{machine_name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{machine_type}</div>
                <p className="text-xs text-muted-foreground">criada em {format(new Date(createdAt), 'dd/MM/yyyy \'às\' HH:mm')}</p>
            </CardContent>
            <CardFooter className='flex w-full justify-end h-10 p-0 m-0 '>
                <ButtonRemoveMachine machine_id={machine_id} />
            </CardFooter>
        </Card>
    )
}
