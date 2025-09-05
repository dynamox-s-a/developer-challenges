import { GridWrapper } from "../components/GridWrapper";
import { PageTitle } from "../layouts/PageTitle";
import { Card } from "../components/Card";
import { CardProperty } from "../components/CardProperty";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { MachineResponse } from "../types/MachineResponse";
import { getListMachine } from "../services/machineService";

export function MachineList() {
  const [machines, setMachines] = useState<MachineResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const data = await getListMachine();
        setMachines(data);
      } catch (error) {
        console.error("Erro ao carregar máquinas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (machines.length === 0) return <p>None machine has been found.</p>;

  return (
    <div className="p-4">
      <PageTitle>Machine List</PageTitle>

      <GridWrapper>
        {machines.map((machine) => (
          <Card
            key={machine.id}
            title={machine.name}
            onClick={() => navigate(`/machine/${machine.id}`)}
            className="cursor-pointer"
          >
            <CardProperty label="Descrição" value={machine.description || "N/A"} />
            <CardProperty label="Serial" value={machine.serialNumber} />
            <CardProperty label="Tipo" value={machine.machineType} />
          </Card>
        ))}
      </GridWrapper>
    </div>
  );
}
