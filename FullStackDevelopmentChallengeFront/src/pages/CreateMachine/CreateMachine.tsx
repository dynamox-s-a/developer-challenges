import React, { useState } from "react";
import { machineTypes } from "../../types/Machine";
import { api } from "../../config/api";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import FormButton from "../../components/FormButton";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { machineSchema } from "../../utils/formValidator";
import { z } from "zod";
import { FormWrapper, Card, Title } from "./style";


type MachineFormData = z.infer<typeof machineSchema>;

const CreateMachine: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
  });

  const onSubmit = async (data: MachineFormData) => {
    setLoading(true);
    try {
      await api.post("/", data);
      alert(`Máquina ${data.name} criada com sucesso!`);
      reset();
    } catch (error) {
      console.error("❌ Erro ao criar máquina:", error);
      alert("Erro ao criar máquina. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper>
      <Card>
        <Title>Create Machine</Title>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="Name"
            placeholder="Digite o nome"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <InputField
            label="Description"
            placeholder="Digite a descrição"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <InputField
            label="Serial Number"
            placeholder="Digite o número de série"
            {...register("serialNumber")}
          />
          {errors.serialNumber && (
            <p className="text-red-500 text-sm">
              {errors.serialNumber.message}
            </p>
          )}

          <SelectField
            label="Machine Type"
            options={machineTypes}
            {...register("machineTypeId")}
          />
          {errors.machineTypeId && (
            <p className="text-red-500 text-sm">
              {errors.machineTypeId.message}
            </p>
          )}

          <FormButton loading={loading}>Criar Máquina</FormButton>
        </form>
      </Card>
    </FormWrapper>
  );
};

export default CreateMachine;
