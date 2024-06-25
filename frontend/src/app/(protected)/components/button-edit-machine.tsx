import { CogIcon } from "lucide-react";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MachineEditForm from "./machine-edit-form";

export function ButtonEditMachine({machine_id}: {machine_id: number}) {
    const [open, setOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleFormSubmit = () => {
        setOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // hide success message after 3 seconds
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" variant={'link'} >
                        <CogIcon className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[80vw] lg:max-w-[425px] rounded-md">
                    <MachineEditForm machine_id={machine_id} onSubmitSuccess={handleFormSubmit} />
                </DialogContent>
            </Dialog>
            {showSuccess && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md">
                    Máquina editada com sucesso!
                </div>
            )}
        </>
    );
}
