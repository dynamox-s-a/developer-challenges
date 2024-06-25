import { format } from 'date-fns'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MachineData } from "@/models/machineModel"
import { ButtonEditMachine } from "./button-edit-machine"


export default function MachineCard({
    machine_id,
    machine_type,
    machine_name,
    createdAt,
}: MachineData
) {
    return (
        <Card className="flex flex-col w-44">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{machine_name}</CardTitle>
                <ButtonEditMachine machine_id={machine_id} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{machine_type}</div>
                <p className="text-xs text-muted-foreground">criada em {format(new Date(createdAt), 'dd/MM/yyyy \'às\' HH:mm')}</p>
            </CardContent>
        </Card>
    )
}
