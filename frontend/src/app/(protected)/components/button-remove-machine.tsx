import { Button } from "@/components/ui/button";
import { Trash2, TrashIcon } from "lucide-react";
import { deleteMachine } from "@/actions/machineManegement";
import { useEffect, useState } from "react";
import { getSessionData } from "@/actions/getSessionData";
import { SessionDataType } from "@/models/userModel";
import { machineAndSensorStore } from "@/contexts/stores/machineAndStore.zustand";

export default function ButtonRemoveMachine({machine_id}: {machine_id: number}) {
    const removeMachine = machineAndSensorStore((state) => state.removeMachine);
    const [session, setSession] = useState<SessionDataType>({} as SessionDataType);

    useEffect(() => {
        const fetchData = async () => {
            const sessionData = await getSessionData();
            setSession(sessionData as SessionDataType);
        };

        fetchData();
    }, []);

    const handleRemove = async () => {
        const isConfirmed = window.confirm('Você deseja remover sua máquina? Essa é uma ação irreversível!');
        if (!isConfirmed) {
            return; 
        }

        console.log('removing machine:', machine_id);

        try {
            await deleteMachine(machine_id, session.accessToken);
            removeMachine(machine_id);
        } catch (error) {
            console.error('Error removing machine:', error);
        }
    }

    return (
        <Button size={'icon'} variant={'link'} onClick={handleRemove}>
            <Trash2 className="h-5 w-5" />
        </Button>
    );
}