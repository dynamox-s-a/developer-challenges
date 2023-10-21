import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addMachine,
  deleteMachine,
  setMachines,
} from "../../../lib/redux/actions/machinesActions";

import {
  addMachineType,
  deleteMachineType,
  setMachineTypes,
} from "../../../lib/redux/actions/machineTypesActions";

import { AppState } from "../../types/types";

const Machines = () => {
  const machineTypes = useSelector((state: AppState) => state.machineTypes);
  const machines = useSelector((state: AppState) => state.machines);
  const dispatch = useDispatch();

  const [machineTypeSelected, setMachineTypeSelected] = useState("");
  const [newMachineType, setNewMachineType] = useState("");
  const [selectedMachineType, setSelectedMachineType] = useState("");

  const [newMachineName, setNewMachineName] = useState("");
  const [newMachineSector, setNewMachineSector] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");

  const [editingMachine, setEditingMachine] = useState<string | null>(null);
  const [editedMachineName, setEditedMachineName] = useState("");
  const [editedMachineSector, setEditedMachineSector] = useState("");

  const handleAddMachineTypes = async (e: any) => {
    e.preventDefault();

    const maxId = Array.isArray(machineTypes)
      ? machineTypes.reduce((max, type) => (type.id > max ? type.id : max), 0)
      : 0;

    const newType = {
      id: maxId + 1,
      machine_type: newMachineType,
    };

    try {
      const response = await fetch("http://localhost:3001/machine_types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newType),
      });

      if (response.ok) {
        dispatch(addMachineType(newType));
        setSelectedMachineType(newType.id);
        setNewMachineType("");
        console.log("Novo tipo de máquina foi salvo com sucesso no DB.");
        fetchMachineTypes();
      } else {
        console.error("Erro ao salvar o novo tipo de máquina no DB.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const handleDeleteMachineTypes = async () => {
    if (selectedMachineType === "") {
      console.error("Selecione um tipo de máquina para excluir.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/machine_types/${selectedMachineType}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(deleteMachineType(selectedMachineType));
        setSelectedMachineType("");
        console.log("Tipo de máquina excluído com sucesso.");
        fetchMachineTypes();
      } else {
        console.error("Erro ao excluir o tipo de máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const fetchMachineTypes = () => {
    fetch("http://localhost:3001/machine_types")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachineTypes(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de tipos de máquina:", error);
      });
  };

  const handleAddMachine = async (e: any) => {
    e.preventDefault();

    const maxId = Array.isArray(machines)
      ? machines.reduce(
          (max, machine) => (machine.id > max ? machine.id : max),
          0
        )
      : 0;

    const newMachine = {
      id: maxId + 1,
      name: newMachineName,
      sector: newMachineSector,
      machine_type_selected: machineTypeSelected,
    };

    try {
      const response = await fetch("http://localhost:3001/machine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMachine),
      });
      if (response.ok) {
        dispatch(addMachine(newMachine));
        setSelectedMachine(newMachine.id);
        setNewMachineName("");
        setNewMachineSector("");
        setMachineTypeSelected("");
        console.log("Nova máquina foi adicionada com sucesso no DB.");
        fetchMachine();
      } else {
        console.error("Erro ao adicionar a nova máquina no DB.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const handleDeleteMachine = async () => {
    if (selectedMachine === "") {
      console.error("Selecione uma máquina para excluir.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/machine/${selectedMachine}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        dispatch(deleteMachine(selectedMachine));
        setSelectedMachine("");
        console.log("Máquina excluída com sucesso.");
        fetchMachine();
      } else {
        console.error("Erro ao excluir a máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  const fetchMachine = async () => {
    fetch("http://localhost:3001/machine")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachines(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de máquina:", error);
      });
  };

  const handleEditMachine = async (e: any) => {
    e.preventDefault();

    if (!editingMachine) {
      console.error("Selecione uma máquina para editar.");
      return;
    }

    try {
      // Recuperar os dados atuais da máquina selecionada
      const response = await fetch(
        `http://localhost:3001/machine/${editingMachine}`
      );
      if (!response.ok) {
        console.error("Erro ao buscar dados da máquina.");
        return;
      }

      console.log(response);

      const machineData = await response.json();

      console.log(machineData);

      // Atualizar os estados com os dados da máquina
      setEditedMachineName(machineData.name);
      setEditedMachineSector(machineData.sector);

      // Agora você pode enviar a solicitação PUT para editar a máquina com os dados atualizados
      const editedMachine = {
        id: editingMachine,
        name: editedMachineName,
        sector: editedMachineSector,
      };

      const putResponse = await fetch(
        `http://localhost:3001/machine/${editingMachine}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedMachine),
        }
      );

      if (putResponse.ok) {
        dispatch(addMachine(editedMachine));
        console.log("Máquina editada com sucesso.");
        fetchMachine(); // Atualize a lista de máquinas
        setEditingMachine(null); // Limpe o estado de edição
        setEditedMachineName(""); // Limpe o nome editado
        setEditedMachineSector(""); // Limpe o setor editado
      } else {
        console.error("Erro ao editar a máquina.");
      }
    } catch (error) {
      console.error("Erro ao fazer a solicitação:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:3001/machine_types")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachineTypes(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de tipos de máquina:", error);
      });

    fetch("http://localhost:3001/machine")
      .then((response) => response.json())
      .then((data) => {
        dispatch(setMachines(data));
      })
      .catch((error) => {
        console.error("Erro ao buscar a lista de máquinas:", error);
      });
  }, []);

  return (
    <div className="ml-20 p-4">
      <h2 className="text-xl font-semibold mb-4">Maquinário</h2>

      <div className="grid grid-cols-1 gap-4">
        <h4 className="pt-4 text-xl">Tipos de Máquina</h4>

        <div className="grid grid-cols-2 gap-4">
          <form
            onSubmit={handleAddMachineTypes}
            className="grid grid-cols-4 gap-2"
          >
            <input
              type="text"
              id="newMachineType"
              name="newMachineType"
              value={newMachineType}
              onChange={(e) => setNewMachineType(e.target.value)}
              placeholder="Adicionar tipo de máquina"
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-3"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg col-span-1"
            >
              Adicionar
            </button>
          </form>

          <div className="grid grid-cols-4 gap-2">
            <select
              id="selectMachineType"
              name="selectMachineType"
              value={selectedMachineType}
              onChange={(e) => setSelectedMachineType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-3"
            >
              <option value="" className="text-gray-500">
                Selecione um tipo de máquina para excluir
              </option>
              {Array.isArray(machineTypes) &&
                machineTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.machine_type}
                  </option>
                ))}
            </select>
            <button
              onClick={handleDeleteMachineTypes}
              className="bg-red-500 text-white px-4 py-2 rounded-lg col-span-1"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h4 className="pt-4 text-xl">Máquinas</h4>
        <div className="grid grid-cols-2 gap-4">
          <form onSubmit={handleAddMachine} className="grid grid-cols-4 gap-2">
            <div className="grid grid-cols-4 gap-2 col-span-3">
              <input
                type="text"
                id="machineName"
                name="machineName"
                value={newMachineName}
                onChange={(e) => setNewMachineName(e.target.value)}
                placeholder="Nome da Máquina"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
              />
              <input
                type="text"
                id="machineSector"
                name="machineSector"
                value={newMachineSector}
                onChange={(e) => setNewMachineSector(e.target.value)}
                placeholder="Setor da Máquina"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
              />
              <select
                id="machineTypeSelected"
                name="machineTypeSelected"
                value={machineTypeSelected}
                onChange={(e) => setMachineTypeSelected(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
              >
                <option value="" className="text-gray-500">
                  Tipo de máquina
                </option>
                {Array.isArray(machineTypes) &&
                  machineTypes.map(
                    (type: { id: string; machine_type: string }) => (
                      <option key={type.id} value={type.machine_type}>
                        {type.machine_type}
                      </option>
                    )
                  )}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg col-span-1"
            >
              Adicionar Máquina
            </button>
          </form>

          <form onSubmit={handleEditMachine} className="grid grid-cols-4 gap-2">
            <div className="grid grid-cols-4 gap-2 col-span-3">
              <select
                id="selectMachine"
                name="selectMachine"
                value={editingMachine || ""}
                onChange={(e) => {
                  const selectedMachineId = e.target.value;
                  setEditingMachine(selectedMachineId);
                  const selectedMachine = Array.isArray(machines)
                    ? machines.find(
                        (machine: { id: string }) =>
                          machine.id === selectedMachineId
                      )
                    : null;
                  if (selectedMachine) {
                    setEditedMachineName(selectedMachine.name);
                    setEditedMachineSector(selectedMachine.sector);
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
                value={editedMachineName}
                onChange={(e) => setEditedMachineName(e.target.value)}
                placeholder="Nome da Máquina"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
              />
              <input
                type="text"
                id="machineSector"
                name="machineSector"
                value={editedMachineSector}
                onChange={(e) => setEditedMachineSector(e.target.value)}
                placeholder="Setor da Máquina"
                className="mt-1 p-2 border border-gray-300 rounded-lg w-full col-span-4"
              />
            </div>

            <div className="grid grid-flow-col gap-4 grid-col-1 grid-rows-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg col-span-1 row-span-1"
              >
                Editar Máquina
              </button>

              <button
                onClick={handleDeleteMachine}
                className="bg-red-500 text-white px-4 py-2 rounded-lg col-span-1 row-span-1"
              >
                Excluir Máquina
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="py-4 grid grid-cols-1 gap-4 w-full justify-items-center"></div>
    </div>
  );
};

export default Machines;
