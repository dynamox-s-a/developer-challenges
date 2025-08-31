// CreateMachine.tsx
import React, { useState } from "react";
import { PageTitle } from "../../layouts/PageTitle";
import { FormWrapper } from "./style";
import { createMachine } from "../../services/machineService";
import MachineForm from "../../features/create/MachineForm";
import type { CreateMachineRequest } from "../../types/CreateMachineRequest";
import { z } from "zod";
import { machineSchema } from "../../utils/formValidator";

type MachineFormData = z.infer<typeof machineSchema>;

const CreateMachine: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: MachineFormData, reset: () => void) => {
    setLoading(true);
    try {
      await createMachine(data as CreateMachineRequest);
      alert(`Machine ${data.name} created with success!`);
      reset(); 
    } catch (error) {
      console.error("Error to create the machine:", error);
      alert("Error to create the machine. Verify the terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      <div className="w-full max-w-md">
        <PageTitle>Create Machine</PageTitle>
        <MachineForm onSubmit={onSubmit} loading={loading} />
      </div>
    </FormWrapper>
  );
};

export default CreateMachine;
