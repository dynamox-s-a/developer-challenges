import { use, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMachine } from "@/actions/machineManegement";
import { getSessionData } from '@/actions/getSessionData';
import { SessionDataType } from '@/models/userModel';
import { MachineData } from '@/models/machineModel';
import { machineAndSensorStore } from '../../../contexts/stores/machineAndStore.zustand'

export default function MachineAddForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
    const addMachine = machineAndSensorStore((state) => state.addMachine);
    const [session, setSession] = useState<SessionDataType | null>(null);
    const [machineName, setMachineName] = useState('');
    const [machineType, setMachineType] = useState('');
    const token = session?.accessToken as string; 

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
            const user_id = session?.user.id as number;
            const machineData: MachineData = {
                monitors: [],
                map: '',
                machine_id: 0,
                createdAt: '',
                updatedAt: '',
                user_id,
                machine_name: machineName,
                machine_type: machineType
            };
            const response = await createMachine(token, machineData);
            if (response){
                addMachine(response);
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
                <DialogTitle>Adicione uma máquina</DialogTitle>
                <DialogDescription>
                    Insira o nome e o tipo da máquina que deseja adicionar.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols items-start gap-4">
                    <Label htmlFor="name" className="text-left">
                        Nome da máquina
                    </Label>
                    <Input id="name" value={machineName} onChange={(e) => setMachineName(e.target.value)} placeholder="Digite o nome de sua máquina" className="col-span-3" />
                </div>
                <div className="grid grid-cols items-center gap-4">
                    <Label htmlFor="machineType" className="text-left">
                        Tipo de máquina
                    </Label>
                    <Select value={machineType} onValueChange={setMachineType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo de máquina" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipos de máquina</SelectLabel>
                                <SelectItem value="Fam">Fam</SelectItem>
                                <SelectItem value="Pump">Pump</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Salvar máquina</Button>
            </DialogFooter>
        </form>
    );
}
