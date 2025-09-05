import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByIdMachine } from "../services/machineService";
import { type MachineResponse } from "../types/MachineResponse";
import { CardProperty } from "../components/CardProperty";
import { Card } from "../components/Card";
import { PageTitle } from "../layouts/PageTitle";


export function MachineDetail() {
  const { id } = useParams<{ id?: string }>();
  const [machine, setMachine] = useState<MachineResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMachine = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getByIdMachine(id);
        setMachine(data);
      } catch (error) {
        console.error("Erro ao carregar máquina:", error);
        setMachine(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!machine) return <p>Machine has not been found.</p>;

  return (
  <div className="p-4">
    <PageTitle>Machine Details</PageTitle>
    <Card title={machine.name}>
      <CardProperty label="Id" value={machine.id} />
      <CardProperty label="Description" value={machine.description || "N/A"} />
      <CardProperty label="Serial" value={machine.serialNumber} />
      <CardProperty label="Type" value={machine.machineType} />
    </Card>
  </div>
  );
}
