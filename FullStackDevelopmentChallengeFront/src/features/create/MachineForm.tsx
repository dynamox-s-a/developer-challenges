import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { machineSchema } from "../../utils/formValidator";
import { z } from "zod";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import FormButton from "../../components/FormButton";
import FormField from "../../components/FormField";
import { getListMachineType } from "../../services/machineTypeService";
import type { MachineType } from "../../types/MachineType";

type MachineFormData = z.infer<typeof machineSchema>;

type MachineFormProps = {
  onSubmit: (data: MachineFormData, reset: () => void) => void;
  loading: boolean;
};

const MachineForm: React.FC<MachineFormProps> = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MachineFormData>({
    resolver: zodResolver(machineSchema),
  });

  const [machineTypes, setMachineTypes] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types: MachineType[] = await getListMachineType();
        setMachineTypes(types.map(mt => ({
          value: mt.id,
          label: mt.typeName
        })));
      } catch (error) {
        console.error("Erro ao carregar Machine Types:", error);
      }
    };

    fetchTypes();
  }, []);

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, reset))} className="space-y-5 w-full">
      <FormField label="Name" error={errors.name?.message}>
        <InputField placeholder="Name" {...register("name")} />
      </FormField>

      <FormField label="Description" error={errors.description?.message}>
        <InputField placeholder="Description" {...register("description")} />
      </FormField>

      <FormField label="Serial Number" error={errors.serialNumber?.message}>
        <InputField placeholder="Serial number" {...register("serialNumber")} />
      </FormField>

      <FormField label="Machine Type" error={errors.machineTypeId?.message}>
        <SelectField
          options={machineTypes}
          {...register("machineTypeId")}
        />
      </FormField>

      <FormButton loading={loading}>Create Machine</FormButton>
    </form>
  );
};

export default MachineForm;
