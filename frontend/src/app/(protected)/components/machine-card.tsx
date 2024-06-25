import { CogIcon } from "lucide-react"
import { format } from 'date-fns'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { MachineData } from "@/models/machineModel"


export default function MachineCard({
    machine_type,
    machine_name,
    createdAt,
}: MachineData
) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{machine_name}</CardTitle>
                <CogIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{machine_type}</div>
                <p className="text-xs text-muted-foreground"> {format(new Date(createdAt), 'dd/MM/yyyy \'às\' HH:mm')}</p>
            </CardContent>
        </Card>
    )
}
