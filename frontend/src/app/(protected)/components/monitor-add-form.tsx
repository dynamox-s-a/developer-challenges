import { use, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSessionData } from '@/actions/getSessionData';
import { SessionDataType } from '@/models/userModel';
import { machineAndSensorStore } from '../../../contexts/stores/machineAndStore.zustand'
import { MonitorsData } from '@/models/monitorsModel';
import { createMonitor } from '@/actions/monitorManegement';
import { MachineData } from '@/models/machineModel';

export default function MonitorAddForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {

    const machine = machineAndSensorStore((state) => state.machines);
    const machineArray = machineAndSensorStore((state) => state.machineArray);
    console.log("Machine Array", machineArray);
    const addMonitor = machineAndSensorStore((state) => state.addMonitor);

    const [session, setSession] = useState<SessionDataType | null>(null);
    const [monitorsName, setMonitorsName] = useState('');
    const [machineId, setMachineId] = useState<number | null>(null);
    const token = session?.accessToken as string;

    const reservedMachineIds = machineArray
        .filter(machine => machine.monitors.length === 2)
        .map(machine => machine.machine_id);

    const filteredMachines = machine.filter(machine => !reservedMachineIds.includes(machine.machine_id));

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

            if (machineId === null) {
                throw new Error('Machine ID is not selected.');
            }

            const response = await createMonitor(token, machineId, monitorsName);
            if (response) {
                addMonitor(response);
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
                <DialogTitle>Adicione um ponto de monitoramento</DialogTitle>
                <DialogDescription>
                    Insira o nome do seu monitor e que máquina deseja monitorar.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols items-start gap-4">
                    <Label htmlFor="name" className="text-left">
                        Nome do ponto de monitoramento
                    </Label>
                    <Input id="name" value={monitorsName} onChange={(e) => setMonitorsName(e.target.value)} placeholder="Digite o nome do seu monitor" className="col-span-3" />
                </div>
                <div className="grid grid-cols items-center gap-4">
                    <Label htmlFor="machineType" className="text-left">
                        Escolha sua máquina para monitorar
                    </Label>
                    <Select value={machineId?.toString()} onValueChange={(value) => setMachineId(parseInt(value))}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo de máquina" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Escolha uma máquina</SelectLabel>
                                {filteredMachines.length === 0 ? (
                                    <p className='px-2 text-red-600'>Nenhuma máquina disponível</p>
                                ) : (
                                    filteredMachines.map((machine) => (
                                        <SelectItem key={machine.machine_id} value={machine.machine_id.toString()}>
                                            {machine.machine_name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button disabled={filteredMachines.length === 0} type="submit">Salvar</Button>
            </DialogFooter>
        </form>
    );
}
