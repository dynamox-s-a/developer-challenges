import { use, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSessionData } from '@/actions/getSessionData';
import { SessionDataType } from '@/models/userModel';
import { machineAndSensorStore } from '../../../contexts/stores/machineAndStore.zustand'
import { createMonitor } from '@/actions/monitorManegement';
import { createSensor } from '@/actions/sensorManegement';

export default function SensorAddForm({ monitor_id, machine_id, machine_type, onSubmitSuccess }: { monitor_id: number; machine_id: number; machine_type: string; onSubmitSuccess: () => void }) {

    const addSensor = machineAndSensorStore((state) => state.addSensor);

    const [session, setSession] = useState<SessionDataType | null>(null);
    const [sensorName, setSensorName] = useState('');
    const token = session?.accessToken as string;

    console.log("Machine ID", machine_id);
    console.log("MAchine type", machine_type);

    useEffect(() => {
        const fetchData = async () => {
            const sessionData = await getSessionData();
            setSession(sessionData as SessionDataType);
        };
        fetchData();
    }, []);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            //@ts-ignore
            const machineId = machine_id.machine_id
            //@ts-ignore
            const monitorId = machine_id.monitor_id

            const response = await createSensor(token, machineId, monitorId, sensorName);
            if (response) {
                addSensor(response);
            }
            console.log(response);
            onSubmitSuccess();
        } catch (error) {
            console.error('Error creating machine:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Adicione um sensor</DialogTitle>
                <DialogDescription>
                    Escolha o tipo de sensor e a que ponto de monitoramento acrescentar.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols items-start gap-4">
                    <Label htmlFor="name" className="text-left">
                        Tipo de sensor
                    </Label>
                    <Select value={sensorName} onValueChange={(value) => setSensorName(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo de sensor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Escolha um tipo de sensor</SelectLabel>
                                {
                                // @ts-ignore
                                machine_id.machine_type === "Pump" ? (

                                    <SelectItem value={"HF+"}>
                                        HF+
                                    </SelectItem>
                                ) : (
                                    <>
                                        <SelectItem value={"TcAg"}>
                                            TcAg
                                        </SelectItem>
                                        <SelectItem value={"TcAs"}>
                                            TcAs
                                        </SelectItem>
                                        <SelectItem value={"HF+"}>
                                            HF+
                                        </SelectItem>
                                    </>
                                )
                                }

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <DialogFooter>
                <Button type="submit">Salvar sensor</Button>
            </DialogFooter>
        </form>
    );
}
