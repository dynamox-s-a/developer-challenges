import { PlusCircle } from "lucide-react";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SensorAddForm from "./sensor-add-form copy";

export function ButtonAddSensor(machine_id: number, machine_type: string, monitor_id: number) {
    const [open, setOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFormSubmit = () => {
        setOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant={'link'} className="gap-2 p-0">
                        <PlusCircle className="h-4 w-4" />
                        Adicionar sensor
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] lg:max-w-[425px] rounded-md">
                    <SensorAddForm machine_id={machine_id} onSubmitSuccess={handleFormSubmit} machine_type={machine_type} monitor_id={monitor_id} />
                </DialogContent>
            </Dialog>
            {showSuccess && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md">
                    Sensor cadastrado com sucesso!
                </div>
            )}
        </>
    );
}
