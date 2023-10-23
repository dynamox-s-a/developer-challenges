import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { consultMachines } from "../../../lib/redux/actions/machinesActions";

import { AppState } from "../../types/types";

const SelectedMachine = () => {
  const machines = useSelector((state: AppState) => state.machines);
  const dispatch = useDispatch();

  const [consultMachine, setConsultMachine] = useState<string | null>(null);
  const [consultMachineName, setConsultMachineName] = useState("");
  const [consultMachineSector, setConsultMachineSector] = useState("");

  const handleConsultMachine = async (e: any) => {
    e.preventDefault();

    if (!consultMachine) {
      console.error("Selecione uma máquina para editar.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3001/machine/${consultMachine}`
      );
      if (!response.ok) {
        console.error("Erro ao buscar dados da máquina.");
        return;
      }

      const machineData = await response.json();

      setConsultMachineName(machineData.name);
      setConsultMachineSector(machineData.sector);

      const editedMachine = {
        id: consultMachine,
        name: consultMachineName,
        sector: consultMachineSector,
      };

      const putResponse = await fetch(
        `http://localhost:3001/machine/${consultMachine}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedMachine),
        }
      );

      if (putResponse.ok) {
        fetchMachine();
        setConsultMachine(null);
        setConsultMachineName("");
        setConsultMachineSector("");
      } else {
        console.error("Erro ao consultar a máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const fetchMachine = async () => {
    fetch("http://localhost:3001/machine")
      .then((response) => response.json())
      .then((data) => {
        dispatch(consultMachines(data));
        if (Array.isArray(data) && data.length > 0) {
          setConsultMachine(data[0].id);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de máquina:", error);
      });
  };

  useEffect(() => {
    fetchMachine();
  }, []);

  return (
    <form onSubmit={handleConsultMachine} className="grid grid-cols-1 gap-2">
      <div className="grid grid-cols-12 gap-2 col-span-1">
        <select
          id="selectMachine"
          name="selectMachine"
          value={consultMachine || ""}
          onChange={(e) => {
            const selectedMachineId = e.target.value;
            setConsultMachine(selectedMachineId);
            const selectedMachine = Array.isArray(machines)
              ? machines.find(
                  (machine: { id: string }) => machine.id === selectedMachineId
                )
              : null;
            if (selectedMachine) {
              setConsultMachineName(selectedMachine.name);
              setConsultMachineSector(selectedMachine.sector);
            }
          }}
          className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
        >
          <option value="" className="text-gray-500">
            Selecione uma máquina para editar
          </option>
          {Array.isArray(machines) &&
            machines.map((machine: { id: string; name: string }) => (
              <option key={machine.id} value={machine.id}>
                {machine.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          id="machineName"
          name="machineName"
          value={consultMachineName}
          onChange={(e) => setConsultMachineName(e.target.value)}
          placeholder="Nome da Máquina"
          className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
        />
        <input
          type="text"
          id="machineSector"
          name="machineSector"
          value={consultMachineSector}
          onChange={(e) => setConsultMachineSector(e.target.value)}
          placeholder="Setor da Máquina"
          className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
        />
      </div>
    </form>
  );
};

export default SelectedMachine;
