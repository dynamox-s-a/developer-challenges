import { useEffect, useState } from 'react'; // Corrigido o import de 'use' para 'useEffect'
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateMachine } from "@/actions/machineManegement"; // Alterado para usar updateMachine
import { getSessionData } from '@/actions/getSessionData';
import { SessionDataType } from '@/models/userModel';
import { MachineData } from '@/models/machineModel';
import { machineAndSensorStore } from '../../../contexts/stores/machineAndStore.zustand'

export default function MachineEditForm({ machine_id, onSubmitSuccess }: { machine_id: number; onSubmitSuccess: (machineId: number) => void }) {
    const updateMachineStore = machineAndSensorStore((state) => state.updateMachine);
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
            const machineData: MachineData = {
                machine_id: machine_id,
                machine_name: machineName,
                machine_type: machineType,
                map: [],
                user_id: 0,
                createdAt: '',
                updatedAt: '',
                monitors: []
            };
            console.log(machineData);
            const response = await updateMachine(machineData, token); 
            if (response){
                updateMachineStore(response.machine_id, response);
            }
            console.log(response);
            onSubmitSuccess(machine_id);
        } catch (error) {
            console.error('Error updating machine:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Edite sua máquina</DialogTitle>
                <DialogDescription>
                    Insira o novo nome e/ou o novo tipo da máquina.
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
