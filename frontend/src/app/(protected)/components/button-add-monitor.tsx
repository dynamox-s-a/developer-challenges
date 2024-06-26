import { PlusCircle } from "lucide-react";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MachineAddForm from "./machine-add-form";
import MonitorAddForm from "./monitor-add-form";

export function ButtonAddMonitor() {
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
                    <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Adicione um ponto de monitoramento
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] lg:max-w-[425px] rounded-md">
                    <MonitorAddForm onSubmitSuccess={handleFormSubmit} />
                </DialogContent>
            </Dialog>
            {showSuccess && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md">
                    Ponto de monitoramento cadastrado com sucesso!
                </div>
            )}
        </>
    );
}
